import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import {
  developmentChains,
  DECIMALS,
  INITAL_ANSWERE,
} from "../helper-hardhat-config";
import { network } from "hardhat";

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainName = network.name;

  if (developmentChains.includes(chainName)) {
    log("Local network detected!, Deploying mocks...");
    await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMALS, INITAL_ANSWERE],
    });

    log("Mock Deployed !");
    log("------------------------------------------------ ");
  }
};

export default deployMocks;
deployMocks.tags = ["all", "mocks"];
