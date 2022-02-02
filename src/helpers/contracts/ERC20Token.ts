import { Contract, providers } from 'ethers'
import ABI from 'src/helpers/abi/ERC20.json'
import { GERC20 } from 'src/types/generated/GERC20'


export class ERC20Token {
  public readonly methods: Contract & GERC20;

  constructor(
    address: string,
    provider?: providers.Provider,
  ) {
    const contract = new Contract(address, ABI, provider)
    this.methods = contract as this['methods']
  }
}
