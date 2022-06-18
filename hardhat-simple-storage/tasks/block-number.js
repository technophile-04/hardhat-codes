const { task } = require("hardhat/config");

task("blockNumber", "Prints the block number").setAction(async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();

    console.log("Current Block Number is : ", blockNumber);
});

module.exports = {};
