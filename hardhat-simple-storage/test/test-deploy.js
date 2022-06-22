const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
describe("SimpleStorage", async () => {
    let SimpleStorageFactory, simpleStorage;

    beforeEach(async () => {
        SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await SimpleStorageFactory.deploy();
        await simpleStorage.deployed();
    });

    it("Should start with fav number 0", async () => {
        const value = await simpleStorage.retrieve();
        const expectedValue = "0";
        assert.equal(value.toString(), expectedValue);
    });

    it("Should update the value of fav number to 10", async () => {
        const txnRes = await simpleStorage.store("10");
        await txnRes.wait(1);

        const updatedValue = await simpleStorage.retrieve();

        assert.equal(updatedValue.toString(), "10");
    });

    it("Should add persons and his favnumber", async () => {
        let txnResponse = await simpleStorage.addPerson("Shiv", "100");
        await txnResponse.wait();

        txnResponse = await simpleStorage.addPerson("Jhon", "200");
        await txnResponse.wait();

        const totalPeople = await simpleStorage.totalPeople();

        assert.equal(totalPeople.toString(), "2");
    });
});
