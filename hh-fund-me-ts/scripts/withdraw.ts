import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { FundMe } from "../typechain";

async function main() {
    const accounts = await ethers.getSigners();
    const deployer: SignerWithAddress = accounts[0];

    const fundMe: FundMe = await ethers.getContract("FundMe", deployer);
    const contractBalance = await ethers.provider.getBalance(fundMe.address);
    console.log(
        "Initial contract balance",
        ethers.utils.formatEther(contractBalance.toString())
    );

    const txnResponse = await fundMe.withdraw();
    await txnResponse.wait();

    const deployerBalance = await ethers.provider.getBalance(deployer.address);

    console.log(
        "Final Deployer Balance",
        ethers.utils.formatEther(deployerBalance.toString())
    );
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(0);
    });
