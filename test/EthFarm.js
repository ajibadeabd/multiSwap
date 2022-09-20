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
describe(" EthFarm contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the ContractFactory and Signers here.
    const EthFarm = await ethers.getContractFactory("EthFarm");
    const [owner, addr1, addr2, addr3, addr5, addr6, addr7, addr8, addr9] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    const hardhatEthFarm = await EthFarm.deploy();

    await hardhatEthFarm.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { EthFarm, hardhatEthFarm, owner, addr1, addr2,addr3, addr5, addr6, addr7, addr8, addr9 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.
//
    // If the callback function is async, Mocha will `await` it.
    it("Should set the time for stake owner and allow users to stake with in the stake range", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { hardhatEthFarm, owner , addr1 ,  addr2,addr3, addr5, addr6 } = await loadFixture(deployTokenFixture);

      // Expect receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      // admin set the time for staking

      await hardhatEthFarm.connect(owner)
      .setTime(Date.now()+ (1000 * 3),Date.now() + 1000 * 60 * 60 )

 
      // six user stake at a time
      await hardhatEthFarm.connect(addr1).stake(tokens("2000"),{
        value:tokens("0.5")
      })
      await hardhatEthFarm.connect(addr2).stake(tokens("1900"),{
        value:tokens("0.5")
      })
      await hardhatEthFarm.connect(addr3).stake(tokens("1800"),{
        value:tokens("0.5")
      })
      
      await hardhatEthFarm.connect(addr5).stake(tokens("2300"),{
        value:tokens("0.5")
      })
      await hardhatEthFarm.connect(addr6).stake(tokens("2300"),{
        value:tokens("0.5")
      })

      // stake twice and see that it will fail
      try{ 
        await hardhatEthFarm.connect(addr1).stake(tokens("2000"),{
        value:tokens("0.5")
      }) 
       } catch(error){

        // user cant stake twice
      expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Can't stake twice'")

      }
      // stakers count will be equal to total amount of stakers which is 1
      expect(await hardhatEthFarm.stakersCount()).to.equal(5);

      // total amount staked
      expect(await hardhatEthFarm.contractBalance()).to.equal(tokens("2.5"))

      // reward time
      await hardhatEthFarm.connect(owner).reward(tokens("2000"))

      expect(await hardhatEthFarm.winnersCount()).to.equal(2)
    });
  });
  describe("fail when stake is not set  ", function () {
   
   
    it("Should  fail when stake has not started", async function () {
      const { hardhatEthFarm, owner , addr1 ,  addr2,addr3, addr5, addr6 } = await loadFixture(deployTokenFixture);
     try  {
        await hardhatEthFarm.connect(addr1).stake(tokens("2000"),{
        value:tokens("0.5")
      })
    } catch(error){
       expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'please check time to stake'")
    }
    })
   
    it("Should  fail when stake wrong amount", async function () {
      const { hardhatEthFarm, owner , addr1 ,  addr2,addr3, addr5, addr6 } = await loadFixture(deployTokenFixture);
     try  {
      await hardhatEthFarm.connect(owner)
      .setTime(Date.now()+ (1000 * 3),Date.now() + (1000 * 3)+1 )

        await hardhatEthFarm.connect(addr1).stake(tokens("2000"),{
        value:tokens("0.9")
      })
    } catch(error){
       expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'incorrect staking balance'")
    }
    })



  })
});
