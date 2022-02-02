import {
  BigNumber,
  utils,
  providers,
  constants,
} from 'ethers'
import uniqBy from 'lodash/uniqBy'
import { Await } from 'src/types/utils'
import { ERC20Token } from 'src/helpers/contracts/ERC20Token'


export type IListTransactions = ReturnType<typeof parseListTransactions>

export type IData = {
  tokenAddress: string;
  listTransactions: IListTransactions;
}

export type ITokenData = Await<ReturnType<typeof getTokenData>>

export const parseListTransactions = (str: string) => (
  str.replace(/\s+/g, ' ').trim().split(' ').map((_) => _.split(',') as [string, string])
)

const validateToken = (address: string) => (
  utils.isAddress(address)
)

const validateListAddresses = (data: IListTransactions) => (
  data.every(([address, amount]) => (
    address && amount
    && utils.isAddress(address)
    && Number(amount).toString() === amount
  ))
)

const validateListUniq = (data: IListTransactions) => (
  uniqBy(data, '0').length === data.length
)

export const validateForm = (data: Omit<IData, 'total'>) => {
  if (!validateToken(data.tokenAddress)) {
    return 'Адрес токена невалидный'
  }

  if (!validateListAddresses(data.listTransactions)) {
    return 'Адрес или количество токенов невалидно'
  }

  if (!validateListUniq(data.listTransactions)) {
    return 'Все адреса должны быть уникальны'
  }

  return true
}

export const getTokenData = async (
  account: string,
  provider: providers.Provider,
  data: IData,
) => {
  const contract = new ERC20Token(data.tokenAddress, provider)

  const [
    name,
    symbol = '',
    decimals = 18,
    allowance = '0',
    balance = '0',
  ] = await Promise.all([
    contract.methods.name(),
    contract.methods.symbol(),
    contract.methods.decimals(),
    contract.methods.allowance(account, process.env.MERKLE_PROOF_AIRDROP_CONTRACT),
    contract.methods.balanceOf(account),
  ]).catch(() => [])

  const totalUnits = data.listTransactions
    .reduce((acc, [, amount]) => (
      acc.add(utils.parseUnits(amount, decimals))
    ), BigNumber.from(0))
    .toString()

  const total = utils.formatUnits(totalUnits, decimals).toString()

  return {
    name,
    symbol,
    decimals,
    total,
    totalUnits,
    allowance: utils.formatUnits(allowance, decimals),
    balance: utils.formatUnits(balance, decimals),
    isEnoughBalance: BigNumber.from(balance).gte(totalUnits),
    isNeedApprove: BigNumber.from(allowance).lt(totalUnits),
  }
}

export const approveToken = async (
  amount: string,
  externalProvider: providers.ExternalProvider,
  data: IData,
) => {
  const webProvider = new providers.Web3Provider(externalProvider)
  const contract = new ERC20Token(data.tokenAddress, webProvider)

  const signer = webProvider.getSigner(0)
  const methods = contract.methods.connect(signer) as ERC20Token['methods']

  const amountUnits = utils.parseUnits(
    amount,
    await contract.methods.decimals(),
  )

  const tx = await methods.approve(
    process.env.MERKLE_PROOF_AIRDROP_CONTRACT,
    amountUnits || constants.MaxUint256.toString(),
  )

  return tx
}
