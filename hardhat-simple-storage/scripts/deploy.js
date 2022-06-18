const { ethers, run, network } = require("hardhat");

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();
    console.log("Contract deployed at : ", simpleStorage.address);

    console.log(network.config);

    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, []);
    }

    const currenValue = await simpleStorage.retrieve();
    console.log("⚡️ ~ file: deploy.js ~ line 17 ~ main ~ currenValue", currenValue);

    const txnRes = await simpleStorage.store("10");
    const txnRecp = await txnRes.wait();

    const updatedValue = await simpleStorage.retrieve();
    console.log("⚡️ ~ file: deploy.js ~ line 23 ~ main ~ updatedValue", updatedValue);
}

async function verify(contractAddress, args) {
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (error) {
        console.log(error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
