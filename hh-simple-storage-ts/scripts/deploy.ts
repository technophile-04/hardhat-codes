import { ethers } from "hardhat";
import { SimpleStorage, SimpleStorage__factory } from "../typechain";

async function main() {
  const SimpleStorageFactory = (await ethers.getContractFactory(
    "SimpleStorage"
  )) as SimpleStorage__factory;

  const simpleStorage = (await SimpleStorageFactory.deploy()) as SimpleStorage;

  await simpleStorage.deployed();

  let txnRecp = await simpleStorage.store("10");

  await txnRecp.wait();

  const updateFavNumber = await simpleStorage.retrieve();
  console.log("⚡️ ~ file: deploy.ts ~ line 18 ~ main ~ updateFavNumber", updateFavNumber);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
