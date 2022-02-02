import {
  BigNumber,
  utils,
  providers,
  constants,
} from 'ethers'
import uniqBy from 'lodash/uniqBy'
import keccak256 from 'keccak256'
import { Buffer } from 'buffer'
import { MerkleTree } from 'merkletreejs'

import { saveFile, getFile } from 'src/api'
import { Await } from 'src/types/utils'
import { ERC20Token } from 'src/helpers/contracts/ERC20Token'
import { MerkleProofAirdrop } from 'src/helpers/contracts/MerkleProofAirdrop'


export type IListTransactions = ReturnType<typeof parseListTransactions>

export type IData = {
  tokenAddress: string;
  listTransactions: IListTransactions;
}

// @ts-ignore TODO
window.Buffer = Buffer

export type ITokenData = Await<ReturnType<typeof getTokenData>>

export const parseListTransactions = (str: string) => (
  str
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((_) => _.split(',') as [string, string])
    .sort((a, b) => +a[0] - +b[0])
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

export const validateForm = (data: IData) => {
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
    address: contract.methods.address,
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

  const amountUnits = amount
    ? utils.parseUnits(amount, await contract.methods.decimals())
    : constants.MaxUint256

  const tx = await methods.approve(
    process.env.MERKLE_PROOF_AIRDROP_CONTRACT,
    amountUnits,
  )

  return tx
}

const dataToBytes = (
  [address, amount]: [string, string],
  decimals: number,
) => {
  const amountUnits = utils.parseUnits(amount, decimals)

  const pack = utils.defaultAbiCoder.encode(
    ['address', 'uint256'],
    [address, amountUnits],
  )

  return pack
}

export const createMerkleTree = (
  list: IData['listTransactions'],
  decimals: number,
) => {
  const leaves = list.map((values) => (
    dataToBytes(values, decimals)
  ))

  // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/test/utils/cryptography/MerkleProof.test.js
  const merkleTree = new MerkleTree(leaves, keccak256, { hashLeaves: true, sortPairs: true })

  return merkleTree
}

export const createNewAirdrop = async (
  data: IData,
  tokenData: ITokenData,
  externalProvider: providers.ExternalProvider,
) => {
  const tree = createMerkleTree(data.listTransactions, tokenData.decimals)
  const response = await saveFile(data)

  const webProvider = new providers.Web3Provider(externalProvider)
  const contract = new MerkleProofAirdrop(process.env.MERKLE_PROOF_AIRDROP_CONTRACT, webProvider)
  const signer = webProvider.getSigner(0)
  const methods = contract.methods.connect(signer) as MerkleProofAirdrop['methods']

  const args = [
    tree.getHexRoot(),
    tokenData.address,
    tokenData.totalUnits,
    response.id,
  ] as const

  const tx = await methods.createNewAirdrop(...args)

  return {
    ...response,
    tx,
  }
}

export const getAirdropData = async (
  id: string,
  provider: providers.Provider,
) => {
  const contract = new MerkleProofAirdrop(process.env.MERKLE_PROOF_AIRDROP_CONTRACT, provider)
  const parameter0 = utils.keccak256(utils.toUtf8Bytes(id))

  const [
    data,
    airdrops,
  ] = await Promise.all([
    getFile<IData>(id),
    contract.methods.airdrops(parameter0),
  ])

  const tokenContract = new ERC20Token(
    airdrops.tokenAddress,
    provider,
  )

  const [
    name,
    symbol,
    decimals,

  ] = await Promise.all([
    tokenContract.methods.name(),
    tokenContract.methods.symbol(),
    tokenContract.methods.decimals(),
  ])

  return {
    data,
    airdrops: {
      claimed: utils.formatUnits(airdrops.claimed, decimals),
      owner: airdrops.owner,
      tokenAddress: airdrops.tokenAddress,
      total: utils.formatUnits(airdrops.total, decimals),
      name,
      symbol,
      decimals,
    },
  }
}

export const claimedDrop = async (
  id: string,
  ethAccount: string,
  amount: string,
  decimals: number,
  data: IData,
  externalProvider: providers.ExternalProvider,
) => {
  const webProvider = new providers.Web3Provider(externalProvider)
  const contract = new MerkleProofAirdrop(process.env.MERKLE_PROOF_AIRDROP_CONTRACT, webProvider)
  const signer = webProvider.getSigner(0)
  const methods = contract.methods.connect(signer) as MerkleProofAirdrop['methods']

  const merkleTree = createMerkleTree(data.listTransactions, decimals)
  const leaf = keccak256(dataToBytes([ethAccount, amount], decimals)) as string
  const proof = merkleTree.getHexProof(leaf)

  const isValid = merkleTree.verify(proof, leaf, merkleTree.getRoot())
  // eslint-disable-next-line no-console
  console.assert(isValid, 'proof is invalid ((')

  const args = [
    proof,
    ethAccount,
    utils.parseUnits(amount, decimals).toString(),
    id,
  ] as const

  const tx = await methods.drop(...args)
  return tx
}
