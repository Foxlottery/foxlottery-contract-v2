import { ethers, network } from "hardhat";
import config from "../config";

const currentNetwork = network.name;
const sleep = (waitTime: any) => new Promise((resolve) => setTimeout(resolve, waitTime));

const main = async (withVRFOnTestnet = true) => {
  const Lottery = await ethers.getContractFactory("LotteryV2");

  if (currentNetwork == "bscTestnet" || currentNetwork == "mumbai") {
    let randomNumberGenerator;

    if (withVRFOnTestnet) {
      console.log("RandomNumberGenerator with VRF is deployed..");
      const RandomNumberGenerator = await ethers.getContractFactory("RandomNumberGenerator");

      randomNumberGenerator = await RandomNumberGenerator.deploy(
        config.VRFCoordinator[currentNetwork],
        config.LinkToken[currentNetwork]
      );
      await randomNumberGenerator.deployed();
      console.log("RandomNumberGenerator deployed to:", randomNumberGenerator.address);

      // Set fee
      await randomNumberGenerator.setFee(config.FeeInLink[currentNetwork]);

      // Set key hash
      await randomNumberGenerator.setKeyHash(config.KeyHash[currentNetwork]);
    } else {
      console.log("RandomNumberGenerator without VRF is deployed..");

      const RandomNumberGenerator = await ethers.getContractFactory("MockRandomNumberGenerator");
      randomNumberGenerator = await RandomNumberGenerator.deploy();
      await randomNumberGenerator.deployed();

      console.log("RandomNumberGenerator deployed to:", randomNumberGenerator.address);
    }

    const lottery = await Lottery.deploy(config.ERC20Token[currentNetwork], randomNumberGenerator.address);

    await lottery.deployed();
    console.log("Lottery deployed to:", lottery.address);

    // Set lottery address
    await randomNumberGenerator.setLotteryAddress(lottery.address);

    // Set operator & treasury adresses
    await lottery.setOperatorAndTreasuryAndInjectorAddresses(
      config.OperatorAddress[currentNetwork],
      config.TreasuryAddress[currentNetwork],
      config.InjectorAddress[currentNetwork]
    );
  } else if (currentNetwork == "bscMainnet") {
    const RandomNumberGenerator = await ethers.getContractFactory("RandomNumberGenerator");
    const randomNumberGenerator = await RandomNumberGenerator.deploy(
      config.VRFCoordinator[currentNetwork],
      config.LinkToken[currentNetwork]
    );

    await randomNumberGenerator.deployed();
    console.log("RandomNumberGenerator deployed to:", randomNumberGenerator.address);

    // Set fee
    await randomNumberGenerator.setFee(config.FeeInLink[currentNetwork]);
    await sleep(5000);

    // Set key hash
    await randomNumberGenerator.setKeyHash(config.KeyHash[currentNetwork]);

    const lottery = await Lottery.deploy(config.ERC20Token[currentNetwork], randomNumberGenerator.address);

    await lottery.deployed();
    console.log("Lottery deployed to:", lottery.address);

    await sleep(5000);
    // Set lottery address
    await randomNumberGenerator.setLotteryAddress(lottery.address);

    await sleep(5000);
    // Set operator & treasury adresses
    await lottery.setOperatorAndTreasuryAndInjectorAddresses(
      config.OperatorAddress[currentNetwork],
      config.TreasuryAddress[currentNetwork],
      config.InjectorAddress[currentNetwork]
    );
  }
};

main(true)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
