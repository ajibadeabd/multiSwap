require("@nomicfoundation/hardhat-toolbox");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      forking: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",

        // url: "https://eth-mainnet.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
      }
      // chainId: 1337 // We set 1337 to make interacting with MetaMask simpler
    }
    // rinkeby: {
    //   accounts: ["8677ed453b15fa2538602b85052b7a8f51fc0c8c1f98ccc994f24260cf8c2163"]
    // }
  }
};

// http://127.0.0.1:7545