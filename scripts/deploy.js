const { ethers, network } = require('hardhat');

async function deploy() {
  console.log('Now deploying on ', network.name);
  const FaucetFactory = await ethers.getContractFactory('Faucet');
  let faucet = await FaucetFactory.deploy();
  faucet = await faucet.deployed();

  console.log('Faucet deployed on address ', faucet.address);
}

(async () => {
  await deploy();
})();
