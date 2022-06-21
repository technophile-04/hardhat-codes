import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { FundMe } from "../typechain";

async function main() {
    const accounts = await ethers.getSigners();
    const deployer: SignerWithAddress = accounts[0];
    const otherFunder: SignerWithAddress = accounts[1];

    const fundMe: FundMe = await ethers.getContract("FundMe", deployer);

    console.log("Funding...");
    let txnResponse = await fundMe.fund({
        value: ethers.utils.parseEther("0.1"),
    });
    await txnResponse.wait(1);
    console.log("Funded!!");

    console.log("Funding with other account");
    txnResponse = await fundMe
        .connect(otherFunder)
        .fund({ value: ethers.utils.parseEther("1") });
    await txnResponse.wait(1);
    console.log("Funded!");
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
