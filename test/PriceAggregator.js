// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const web3 = require("Web3");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage or Hardhat Network's snapshot functionality.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
function tokens(n) {
  return web3.utils.toWei(n, "ether");
}
// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("PriceAggregator", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the ContractFactory and Signers here.
    const PriceConsumerV3 = await ethers.getContractFactory("PriceConsumerV3");
    const [owner, addr1, addr2, addr3, addr5, addr6, addr7, addr8, addr9] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    const PriceConsumerV3D = await PriceConsumerV3.deploy();

    await PriceConsumerV3D.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { PriceConsumerV3, PriceConsumerV3D, owner, addr1 };
  }

  // You can nest describe calls to create subsections.
  describe("get eth/price ", function () {
   
    it("Should  fail when stake wrong amount", async function () {
      const { PriceConsumerV3D, owner, addr1 } = await loadFixture(deployTokenFixture);
     try  {
         let price  = await PriceConsumerV3D.getLatestPrice
         console.log(price,2)
    
    } catch(error){
        console.log(error.message,2)
    //    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'incorrect staking balance'")
    }
    })
  })

});
