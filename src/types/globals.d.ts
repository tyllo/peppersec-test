import { MetaMaskInpageProvider } from '@metamask/providers'
import { providers } from 'ethers'


declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider & providers.ExternalProvider;
  }
}
