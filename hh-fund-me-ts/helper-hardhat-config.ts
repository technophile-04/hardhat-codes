export interface networkConfigItem {
  ethUsdPriceFeed?: string;
  blockConfirmations?: number;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

const networkConfig: networkConfigInfo = {
  rinkeby: {
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    blockConfirmations: 6,
  },
  mumbai: {
    ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
    blockConfirmations: 6,
  },
};

const developmentChains = ["hardhat", "localhost"];

const DECIMALS = 8;
const INITAL_ANSWERE = 200000000000;

export { networkConfig, developmentChains, DECIMALS, INITAL_ANSWERE };
