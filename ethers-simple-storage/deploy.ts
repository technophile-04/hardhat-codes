// const ethers = require("ethers");
// const fs = require("fs-extra");
// require("dotenv").config();
import { ethers } from "ethers";
import * as fs from "fs-extra";
import "dotenv/config";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const bytecode = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");

  // Deploying the contract :
  const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
  console.log("Waiting for deploy...");
  const contract = await contractFactory.deploy();
  const address = contract.address;
  console.log("Contract deployed at address : " + address);

  // Waiting for 1 block confirmation
  const txnRecipet = await contract.deployTransaction.wait(1);

  /* 
        txnRecipet - is what you get when wait for block confirmation
        contract.deployTransaction - just when you create your transaction
    */

  /* console.log(
		'🚀 ----------------------------------------------------------------------------🚀'
	);
	console.log(
		'🚀 ~ Deployment Transaction(transaction response) :  file: deploy.js ~ line 26 ~ main ~ deploymentReceipt',
		contract.deployTransaction
	);
	console.log(
		'🚀 ----------------------------------------------------------------------------🚀'
	);

	console.log(
		'🚀 ----------------------------------------------------------------------------🚀'
	);
	console.log(
		'🚀Deployemnt recipet: ~ file: deploy.js ~ line 26 ~ main ~ deploymentReceipt',
		txnRecipet
	);
	console.log(
		'🚀 ----------------------------------------------------------------------------🚀'
	); */

  //-----------------------------------------------------------------------------------
  // Deploying through creating own transaction
  //-----------------------------------------------------------------------------------
  /* 	
		const nonce = await wallet.getTransactionCount();
		const tx = {
			nonce: nonce,
			gasPrice: 20000000000,
			gasLimit: 1000000,
			to: null,
			value: 0,
			data: '0x' + bytecode,
			chainId: 1337,
		};

		// Signing the transaction
		const singedTransaction = await wallet.signTransaction(tx);
		console.log(
			'🚀 ----------------------------------------------------------------------------🚀'
		);
		console.log(
			'🚀 ~ file: deploy.js ~ line 74 ~ main ~ singedTransaction',
			singedTransaction
		);
		console.log(
			'🚀 ----------------------------------------------------------------------------🚀'
		);

		const sendTxRes = await wallet.sendTransaction(tx);
		const txRecipet = await sendTxRes.wait(1);
		console.log(
			'🚀 ------------------------------------------------------------🚀'
		);
		console.log('🚀 ~ file: deploy.js ~ line 86 ~ main ~ sendTxRes', txRecipet);
		console.log(
			'🚀 ------------------------------------------------------------🚀'
		); 
	*/

  // -----------------------------------------------------------------------------------
  // Getting number
  // -----------------------------------------------------------------------------------
  const favNumber = await contract.retrieve();
  console.log("🚀 ------------------------------------------------------------🚀");
  console.log("🚀 ~ file: deploy.js ~ line 99 ~ main ~ curr favNumber", favNumber);
  console.log("🚀 ------------------------------------------------------------🚀");

  // Updating number
  const txnResponse = await contract.store("10");
  const transactionRecp = await txnResponse.wait(1);
  console.log("🚀 -------------------------------------------------------------------------🚀");
  console.log("🚀 ~ file: deploy.js ~ line 113 ~ main ~ transactionRecp", transactionRecp);
  console.log("🚀 -------------------------------------------------------------------------🚀");
  const currFavNumber = await contract.retrieve();
  console.log("TCL ~ file: deploy.js ~ line 116 ~ main ~ currFavNumber", currFavNumber);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
