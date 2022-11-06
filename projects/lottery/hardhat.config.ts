import type { NetworkUserConfig, HttpNetworkConfig } from "hardhat/types";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-truffle5";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "solidity-coverage";
import "dotenv/config";
import "hardhat-gas-reporter";

const gas = "auto";
const gasPrice = "auto";
const gasMultiplier = 1;
const timeout = 5000;

const bscTestnet: HttpNetworkConfig = {
  url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  chainId: 97,
  accounts: process.env.KEY_TESTNET !== undefined ? [process.env.KEY_TESTNET] : [],
  gas,
  gasPrice,
  gasMultiplier,
  timeout,
  httpHeaders: {},
};

const bscMainnet: NetworkUserConfig = {
  url: "https://bsc-dataseed.binance.org/",
  chainId: 56,
  accounts: process.env.KEY_MAINNET !== undefined ? [process.env.KEY_MAINNET] : [],
};

const mumbai: NetworkUserConfig = {
  url: "https://polygon-mumbai.g.alchemy.com/v2/U72JPoKDH5RmMv9HdaMra3AL9a3vrZ0_",
  chainId: 80001,
  accounts: process.env.KEY_MAINNET !== undefined ? [process.env.KEY_MAINNET] : [],
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      gas: 120000000,
      blockGasLimit: 0x1fffffffffffff,
    },
    bscTestnet,
    bscMainnet,
    mumbai,
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 99999,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  abiExporter: {
    path: "./data/abi",
    clear: true,
    flat: false,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    token: "BNB",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    gasPriceApi: "https://api.bscscan.com/api?module=proxy&action=eth_gasPrice",
    onlyCalledMethods: false,
    noColors: true,
    rst: true,
    showTimeSpent: true,
    excludeContracts: ["Migrations"],
    proxyResolver: "EtherRouter",
    showMethodSig: true,
  },
};

export default config;
