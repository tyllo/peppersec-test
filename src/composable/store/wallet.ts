import { ref, markRaw, computed } from 'vue'
import { MetaMaskInpageProvider } from '@metamask/providers'
import { providers } from 'ethers'
import { shortenAddress } from 'src/helpers/shortenAddress'
import { NetworkNames } from 'src/helpers/enums/networks'
import {
  ERROR_MESSAGE_INSTALL_METAMASK,
  ERROR_MESSAGE_EMPTY_ACCOUNT,
  ERROR_MESSAGE_CONNECTION_WRONG,
} from 'src/helpers/enums/errorMessages'
import { formatHumanTokenAmount } from 'src/helpers/formatters'


const getDefaultWebProvider = (
  // @ts-ignore TODO
  chainIdInner?: number,
) => {
  const networkName = (
    NetworkNames[chainIdInner as number]
    || process.env.NETWORK_NAME
  )

  const url = chainIdInner === NetworkNames.mainnet
    ? `wss://infura.io/ws/v3/${process.env.INFURA_KEY}`
    : `wss://${networkName}.infura.io/ws/v3/${process.env.INFURA_KEY}`

  const provider = new providers.WebSocketProvider(url)
  return provider
}

const isLoadingConnect = ref(false)
const chainId = ref<number>()
const ethAccount = ref<string>()
const balanceUnits = ref<string>()
const externalProvider = ref<MetaMaskInpageProvider & providers.ExternalProvider>()
const webProvider = ref<providers.WebSocketProvider | providers.Web3Provider>(
  markRaw(getDefaultWebProvider()),
)

const ethAccountShort = computed(() => (
  ethAccount.value
  && shortenAddress(ethAccount.value)
))

const balanceETH = computed(() => (
  formatHumanTokenAmount(balanceUnits.value)
))

const isConnected = computed(() => (
  !!ethAccount.value
))

const isSupportedNetwork = computed(() => (
  !!chainId.value
  && NetworkNames[chainId.value] === process.env.NETWORK_NAME
))

const updateBalance = async () => {
  const address = ethAccount.value
  if (!address) return false

  const balance = await webProvider.value?.getBalance(address)
  balanceUnits.value = balance?.toString()
  return true
}

const disconnect = () => {
  externalProvider.value?.removeAllListeners()
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  webProvider.value?.off('block', updateBalance)

  chainId.value = void 0
  ethAccount.value = void 0
  balanceUnits.value = void 0
}

const subscribeOnWalletEvents = () => {
  const provider = externalProvider.value
  if (!provider) return

  const onEventClose = () => void disconnect()
  const onEventDisconnect = () => void disconnect()
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const onEventConnect = () => void connectToMetamask()

  const onEventChainChanged = (arg: unknown) => {
    const id = +(arg as string)
    if (chainId.value === id) return
    chainId.value = id
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    void connectToMetamask()
  }

  const onEventAccountsChanged = (arg: unknown) => {
    const accounts = arg as [string?]

    if (accounts.length) {
      [ethAccount.value] = accounts
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      void connectToMetamask()
    } else {
      void disconnect()
    }
  }

  provider.removeAllListeners()
  provider.on('close', onEventClose)
  provider.on('disconnect', onEventDisconnect)
  provider.on('connect', onEventConnect)
  provider.on('chainChanged', onEventChainChanged)
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  provider.on('accountsChanged', onEventAccountsChanged)
}

const subscribeOnBlock = () => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  webProvider.value?.on('block', updateBalance)
}

const connectToMetamask = async () => {
  const { ethereum } = window

  if (!ethereum) {
    return Promise.reject(ERROR_MESSAGE_INSTALL_METAMASK)
  }

  isLoadingConnect.value = true

  try {
    const [account] = await ethereum.request({
      method: 'eth_requestAccounts',
    }) as [string?]

    if (!account) {
      return Promise.reject(ERROR_MESSAGE_EMPTY_ACCOUNT)
    }

    ethAccount.value = account
    externalProvider.value = markRaw(ethereum)

    if (ethereum.chainId) {
      chainId.value = +ethereum.chainId
    }

    // TODO: close webSocket
    // webProvider.value.close()

    if (chainId.value && NetworkNames[chainId.value]) {
      const provider = getDefaultWebProvider(chainId.value)
      webProvider.value = markRaw(provider)
    } else {
      webProvider.value = new providers.Web3Provider(
        ethereum as unknown as providers.ExternalProvider,
      )
    }

    subscribeOnWalletEvents()
    subscribeOnBlock()
    await updateBalance()

    return true
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return Promise.reject(ERROR_MESSAGE_CONNECTION_WRONG)
  }
}

const switchEthereumChain = () => {
  const { ethereum } = window

  if (!ethereum) {
    return Promise.reject(ERROR_MESSAGE_INSTALL_METAMASK)
  }

  const name = process.env.NETWORK_NAME as unknown as NetworkNames
  const id = (NetworkNames[name] as unknown as number)?.toString(16)

  return ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${id}` }],
  })
}

export const useWallet = () => ({
  state: {
    isLoadingConnect,
    chainId,
    ethAccount,
    balanceUnits,
    externalProvider,
    webProvider,
  },
  getters: {
    isConnected,
    isSupportedNetwork,
    ethAccountShort,
    balanceETH,
  },
  actions: {
    connectToMetamask,
    switchEthereumChain,

    disconnect,
    updateBalance,
  },
})
