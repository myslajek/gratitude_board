import { NetworkConfig } from "../models/NetworkConfig";

export enum SupportedNetwork{
    sonicTestnet,
    sonic,
}

export const NetworkConfigs: { [key in SupportedNetwork]: NetworkConfig } = {
  [SupportedNetwork.sonicTestnet]: {
    name: 'Sonic Blaze Testnet',
    rpcUrl: 'https://rpc.blaze.soniclabs.com',
    blockExplorer: 'https://testnet.sonicscan.org/',
    chainId: 57054,
  },
  [SupportedNetwork.sonic]: {
    name: 'Sonic',
    rpcUrl: 'https://rpc.soniclabs.com',
    blockExplorer: 'https://sonicscan.org/',
    chainId: 146,
  },
};