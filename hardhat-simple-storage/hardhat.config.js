require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("./tasks/block-number");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const { PRIVATE_KEY, RINKEBY_RPC_URL, ETHERSCAN_API_KEY } = process.env;

module.exports = {
    solidity: "0.8.4",
    networks: {
        rinkeby: {
            chainId: 4,
            accounts: [PRIVATE_KEY],
            url: RINKEBY_RPC_URL,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        // cointmarketcap : COINMARKETCAP_KEY
    },
};
