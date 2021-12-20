const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with the account: ", deployer.address);
  // console.log("Deployer account balance: ", accountBalance.toString());
  console.log("Deployer account balance(ETH): ", hre.ethers.utils.formatEther(accountBalance));

  // Compile the contract
  const Token = await hre.ethers.getContractFactory("WavePortal");

  // Deploy the contract and pass Ether to the contract
  const portal = await Token.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });
 
  // Wait for the contract to be deployed
  await portal.deployed();

  console.log("WavePortal address: ", portal.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
