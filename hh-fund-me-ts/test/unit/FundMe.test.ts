import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { FundMe, MockV3Aggregator } from "../../typechain";

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe: FundMe;
          let mockV3Aggregator: MockV3Aggregator;
          let deployer: SignerWithAddress;
          const value = ethers.utils.parseEther("1");

          beforeEach(async () => {
              // it will  run all the deploy scripts with tags 'all' in deploy folder
              await deployments.fixture(["all"]);
              const accounts = await ethers.getSigners();
              deployer = accounts[0];
              fundMe = await ethers.getContract("FundMe", deployer);
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              );
          });

          describe("Constructor", async () => {
              it("sets the aggregator address correctly", async () => {
                  const res = await fundMe.priceFeed();
                  assert.equal(res, mockV3Aggregator.address);
              });
          });

          describe("fund", async () => {
              beforeEach(async () => {
                  const txnRecp = await fundMe.fund({ value });
                  await txnRecp.wait();
              });
              it("Fails if you don't spend enough ETH", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "Price is lower, send more"
                  );
              });

              it("update the amount funded data structure", async () => {
                  const fundedAmount = await fundMe.addressToAmountFunded(
                      deployer.address
                  );

                  assert.equal(fundedAmount.toString(), value.toString());
              });

              it("Add funder to array of funders", async () => {
                  const funder = await fundMe.funders(0);
                  assert(funder, deployer.address);
              });
          });

          describe("receive", async () => {
              beforeEach(async () => {
                  const txnResponse = await deployer.sendTransaction({
                      to: fundMe.address,
                      data: "0x",
                      value: value,
                  });
                  await txnResponse.wait(1);
              });

              it("update the amount funded data structure by calling receive", async () => {
                  const fundedAmount = await fundMe.addressToAmountFunded(
                      deployer.address
                  );

                  assert.equal(fundedAmount.toString(), value.toString());
              });

              it("Add funder to array of funders by calling receive", async () => {
                  const funder = await fundMe.funders(0);
                  assert(funder, deployer.address);
              });
          });

          describe("fallback", async () => {
              beforeEach(async () => {
                  const txnResponse = await deployer.sendTransaction({
                      to: fundMe.address,
                      data: "0xabcd1234",
                      value: value,
                  });
                  await txnResponse.wait(1);
              });

              it("update the amount funded data structure by calling fallback", async () => {
                  const fundedAmount = await fundMe.addressToAmountFunded(
                      deployer.address
                  );

                  assert.equal(fundedAmount.toString(), value.toString());
              });

              it("Add funder to array of funders by calling fallback", async () => {
                  const funder = await fundMe.funders(0);
                  assert(funder, deployer.address);
              });
          });

          describe("withdraw", async () => {
              beforeEach(async () => {
                  const txnResponse = await fundMe.fund({ value });
                  const txnReceipt = await txnResponse.wait(1);
              });

              it("Withdraw eth from single funder", async () => {
                  // Arrange
                  const startingFundeMeBalance =
                      await ethers.provider.getBalance(fundMe.address);

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address);
                  // Act
                  const txnResponse = await fundMe.withdraw();
                  const txnReceipt = await txnResponse.wait();
                  const { gasUsed, effectiveGasPrice } = txnReceipt;

                  const totalGasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address);

                  // Assert
                  assert.equal(endingFundMeBalance.toString(), "0");
                  assert.equal(
                      startingFundeMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(totalGasCost).toString()
                  );
              });
              it("cheaper withdraw :  eth from single funder", async () => {
                  // Arrange
                  const startingFundeMeBalance =
                      await ethers.provider.getBalance(fundMe.address);

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address);
                  // Act
                  const txnResponse = await fundMe.cheaperWithdraw();
                  const txnReceipt = await txnResponse.wait();
                  const { gasUsed, effectiveGasPrice } = txnReceipt;

                  const totalGasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address);

                  // Assert
                  assert.equal(endingFundMeBalance.toString(), "0");
                  assert.equal(
                      startingFundeMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(totalGasCost).toString()
                  );
              });

              it("Allow us to withdraw with multiple funders", async () => {
                  const accounts = await ethers.getSigners();
                  for (let index = 1; index < 6; index++) {
                      // const element = accounts[index];
                      const fundMeConnected = await fundMe.connect(
                          accounts[index]
                      );
                      await fundMeConnected.fund({ value });
                  }

                  const startingFundeMeBalance =
                      await ethers.provider.getBalance(fundMe.address);

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address);

                  const txnResponse = await fundMe.withdraw();
                  const txnReceipt = await txnResponse.wait();
                  const { gasUsed, effectiveGasPrice } = txnReceipt;

                  const totalGasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address);

                  // Assert
                  assert.equal(endingFundMeBalance.toString(), "0");
                  assert.equal(
                      startingFundeMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(totalGasCost).toString()
                  );

                  await expect(fundMe.funders(0)).to.be.reverted;

                  for (let index = 1; index < 6; index++) {
                      // const element = accounts[index];
                      assert.equal(
                          (
                              await fundMe.addressToAmountFunded(
                                  accounts[index].address
                              )
                          ).toString(),
                          "0"
                      );
                  }
              });

              it("cheaper withdraw : Allow us to withdraw with multiple funders", async () => {
                  const accounts = await ethers.getSigners();
                  for (let index = 1; index < 6; index++) {
                      // const element = accounts[index];
                      const fundMeConnected = await fundMe.connect(
                          accounts[index]
                      );
                      await fundMeConnected.fund({ value });
                  }

                  const startingFundeMeBalance =
                      await ethers.provider.getBalance(fundMe.address);

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address);

                  const txnResponse = await fundMe.cheaperWithdraw();
                  const txnReceipt = await txnResponse.wait();
                  const { gasUsed, effectiveGasPrice } = txnReceipt;

                  const totalGasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address);

                  // Assert
                  assert.equal(endingFundMeBalance.toString(), "0");
                  assert.equal(
                      startingFundeMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(totalGasCost).toString()
                  );

                  await expect(fundMe.funders(0)).to.be.reverted;

                  for (let index = 1; index < 6; index++) {
                      // const element = accounts[index];
                      assert.equal(
                          (
                              await fundMe.addressToAmountFunded(
                                  accounts[index].address
                              )
                          ).toString(),
                          "0"
                      );
                  }
              });

              it("Only owner should withdraw", async () => {
                  const accounts = await ethers.getSigners();
                  const attacker = accounts[1];
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  );

                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWith("FundMe__NotOwner");
              });
          });
      });
