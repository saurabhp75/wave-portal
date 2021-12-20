const main = async () => {
  // Hardhat Runtime Environment (hre)is an object containing all the functionality 
  // that Hardhat exposes when running a task, test or script.
  // No need to import hre as its is provided by the command npx hardhat....
  // Get the Signer(s) there are 20 signers
  const Signers = await hre.ethers.getSigners();

  console.log("Total signers provided by Hardhat:", Signers.length);

  // Signer object
  // console.log("First signer provided by Hardhat:", Signers[0]);
  const [owner, randomPerson] = Signers;

  let deployerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log(
    "Deployer Starting/before deploying balance(ETH):",
    hre.ethers.utils.formatEther(deployerBalance)
  );

  // Compile the contract and get the Contract object
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");

  // 'owner' is deploying the contract here and funding 0.1 ETH to the contract
  // Here owner is provided by Hardhat by the first of test accounts
  // In real life, contract is deployed once and accessed by Web3 apps via Metamak.
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });

  // Constructor has run at this point
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  deployerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log(
    "Deployer balance after contract is deployed(ETH):",
    hre.ethers.utils.formatEther(deployerBalance)
  );

  // Get Contract balance
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );

  console.log(
    "Contract starting balance balance (ETH):",
    hre.ethers.utils.formatEther(contractBalance)
  );

  // let msgCount;
  // msgCount = await waveContract.getMessagesNumber();
  // console.log(msgCount.toNumber());

  // Send message transaction
  let waveTxn = await waveContract.sendMessage("This is message #1");
  await waveTxn.wait(); // Wait for transaction to be mined

  let waveTxn2 = await waveContract.sendMessage("This is message #2");
  await waveTxn2.wait(); // Wait for transaction to be mined

  let waveTxn3 = await waveContract
    .connect(randomPerson)
    .sendMessage("This is message #3");
  await waveTxn2.wait(); // Wait for transaction to be mined
  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance(ETH):",
    hre.ethers.utils.formatEther(contractBalance)
  );

  // const [_, randomPerson] = await hre.ethers.getSigners();

  // Enable randomPerson to call a contract function
  // waveTxn = await waveContract
  //   .connect(randomPerson)
  //   .sendMessage("Another message");
  // await waveTxn.wait(); //Wait for transaction to be mined

  let allMsgs = await waveContract.getAllMsgs();
  console.log(allMsgs);

  waveCount = await waveContract.getMessagesNumber();
  // waveCount = await waveContract.getMessagesNumber();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
