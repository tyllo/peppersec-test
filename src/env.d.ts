declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;

    MERKLE_PROOF_AIRDROP_CONTRACT: string;
    NETWORK_NAME: string;
    NETWORK_CHAIN_ID: string;
  }
}
