import { NetworkConfig } from "../models/NetworkConfig";

export enum SupportedNetwork{
    sonicTestnet,
}

export const NetworkConfigs: { [key in SupportedNetwork]: NetworkConfig } = {
  [SupportedNetwork.sonicTestnet]: {
    name: 'Sonic Blaze Testnet',
    rpcUrl: 'https://rpc.blaze.soniclabs.com',
    blockExplorer: 'https://testnet.sonicscan.org/',
    chainId: 57054,
  },
};