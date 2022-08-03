require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');

require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.13',
  networks: {
    bitgert: {
      url: 'https://testnet-rpc.brisescan.com',
      accounts: [process.env.PRIVATE_KEY],
      chainId: 64668
    }
  }
};
