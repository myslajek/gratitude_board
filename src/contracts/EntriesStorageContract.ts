import { ethers } from "ethers";
import { NetworkConfig } from "../models/NetworkConfig";
import { NetworkConfigs, SupportedNetwork } from "../constants/Networks";
import EntriesStorageABI from "../assets/contracts_abi/EntriesStorageAbi.json";
import Entry from "../models/Entry";

export default class EntriesStorageContract {
  private contract: ethers.Contract;
  private provider: ethers.JsonRpcProvider;
  private networkConfig: NetworkConfig;
  private contractAddress: string;

  constructor() {
    this.contractAddress = "0x18c572D691A54cf7d19a10E570Bc71DA6bffcC28";
    this.networkConfig = NetworkConfigs[SupportedNetwork.sonicTestnet];
    this.provider = new ethers.JsonRpcProvider(this.networkConfig.rpcUrl);
    this.contract = new ethers.Contract(
      this.contractAddress,
      EntriesStorageABI as ethers.InterfaceAbi,
      this.provider
    );
  }

  async getAllEntries(): Promise<Entry[]> {
    try {
      const entries = await this.contract.getAllEntries();
      return entries.map((entry: any) => ({
        value: entry.value,
        timestamp: Number(entry.timestamp),
        author: entry.address,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch entries: ${error}`);
    }
  }

  async onEntryAdded(
    callback: (user: string, value: string, index: number, event: any) => void
  ) {
    const listener = (
      user: string,
      value: string,
      index: ethers.BigNumberish,
      event: any
    ) => {
      try {
        callback(user, value, Number(index), event);
      } catch (error) {
        console.error("Error in EntryAdded callback:", error);
      }
    };

    this.contract.on("EntryAdded", listener);
    console.log("EntryAdded listener attached");

    return () => {
      try {
        this.contract.off("EntryAdded", listener);
        console.log("EntryAdded listener removed");
      } catch (error) {
        console.error("Error removing EntryAdded listener:", error);
      }
    };
  }

  async onEntryRemoved(
    callback: (manager: string, index: number, value: string) => void
  ) {
    const listener = (
      manager: string,
      index: ethers.BigNumberish,
      value: string
    ) => {
      try {
        callback(manager, Number(index), value);
      } catch (error) {
        console.error("Error in EntryRemoved callback:", error);
      }
    };

    this.contract.on("EntryRemoved", listener);
    console.log("EntryRemoved listener attached");

    return () => {
      try {
        this.contract.off("EntryRemoved", listener);
        console.log("EntryRemoved listener removed");
      } catch (error) {
        console.error("Error removing EntryRemoved listener:", error);
      }
    };
  }
}

export const EntriesContract = new EntriesStorageContract();
