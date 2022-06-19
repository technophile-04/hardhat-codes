import { assert } from "chai";
import { ethers } from "hardhat";
import { SimpleStorage, SimpleStorage__factory } from "../typechain";

describe("SimpleStorage", async () => {
  let SimpleStorageFactory: SimpleStorage__factory, simpleStorage: SimpleStorage;

  beforeEach(async () => {
    SimpleStorageFactory = (await ethers.getContractFactory(
      "SimpleStorage"
    )) as SimpleStorage__factory;

    simpleStorage = await SimpleStorageFactory.deploy();

    simpleStorage.deployed();
  });

  it("Should assign favnumber to zero", async () => {
    const value = await simpleStorage.retrieve();

    assert.equal(value.toString(), "0");
  });

  it("Should update favnumber to 10", async () => {
    const txnRecp = await simpleStorage.store("10");
    await txnRecp.wait();

    const value = await simpleStorage.retrieve();

    assert.equal(value.toString(), "10");
  });

  it("Should add persons and his favnumber", async () => {
    const txnRecp = await simpleStorage.addPerson("Shiv", "100");
    await txnRecp.wait();

    const totalPeople = await simpleStorage.totalPeople();

    assert.equal(totalPeople.toString(), "1");
  });
});
