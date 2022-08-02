const { expect, use } = require('chai');
const { ethers, waffle } = require('hardhat');

use(waffle.solidity);

describe('Faucet Tests', () => {
  /**
   * @type import('ethers').Contract
   */
  let faucet;

  before(async () => {
    const FaucetFactory = await ethers.getContractFactory('Faucet');
    faucet = await FaucetFactory.deploy();
    faucet = await faucet.deployed();

    const [signer1] = await ethers.getSigners();
    await signer1.sendTransaction({
      to: faucet.address,
      value: ethers.utils.parseEther('2000'),
      gasLimit: 22000,
      gasPrice: ethers.utils.parseUnits('10', 'gwei')
    });
  });

  it('should dispense ether', async () => {
    const [, signer2] = await ethers.getSigners();
    await expect(
      await faucet.dispense(ethers.constants.AddressZero, signer2.address, ethers.utils.parseEther('10'))
    ).to.changeEtherBalance(signer2, ethers.utils.parseEther('10'));
  });

  it('should prevent dispensing to an already paid address until after 24 hours', async () => {
    const [, signer2] = await ethers.getSigners();
    await expect(
      faucet.dispense(ethers.constants.AddressZero, signer2.address, ethers.utils.parseEther('10'))
    ).to.be.revertedWith('must_be_called_within_24_hours');
  });

  it('should prevent dispensing when paused', async () => {
    const [, , signer3] = await ethers.getSigners();
    await faucet.pause();
    await expect(
      faucet.dispense(ethers.constants.AddressZero, signer3.address, ethers.utils.parseEther('10'))
    ).to.be.revertedWith('Pausable: paused');
  });
});
