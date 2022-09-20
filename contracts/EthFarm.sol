//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import "hardhat/console.sol";


// This is the main building block for smart contracts.
contract EthFarm {
    // Some string type variables to identify the token.
    string public name = "The Eth Farm";
    string public symbol = "TEF";


    // 5% range Plus or minus the current price
    uint256 public range = 5;

    uint256 public openingTime;
    uint256 public closeTime;

    uint256 public stakeAmount = 0.05 * (10**18);

    // A mapping is a key/value map. Here we store each  stakingBalance.
    mapping(address => bool) public hasStake;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    address[] public stakers;
    address[] public rewardersAddress;

    

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) predictedPrices;
 
    /**
     * Contract initialization.
     */
    constructor() {
        // The totalSupply is assigned to the transaction sender, which is the
        // account that is deploying the contract.
        // balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }
     
    modifier onlyOwner {
      require(msg.sender == owner);
      _;
   }
    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function stake(uint256 predictedPrice) public payable {

        uint256 currentTime = block.timestamp;

        if(currentTime < openingTime || currentTime > closeTime){
            revert("please check time to stake");
        }

        require(!hasStake[msg.sender], "Can't stake twice");

        require(stakeAmount ==  msg.value, "staking balance must be ");

        predictedPrices[msg.sender] = predictedPrice;

        hasStake[msg.sender] = true;
        stakers.push(msg.sender);
    }



     function reward(uint256 ethAmount) onlyOwner external {
        // Issue tokens to all stakers
        uint stakersLength  = stakers.length;
        // save in state so as not to visit storage on every iteration
        address[] memory stakersCopy = stakers;

        for (uint i=0; i<stakersLength; i++) {

            address rewardReciver = stakersCopy[i];
            uint predictedAmount = predictedPrices[rewardReciver];

            uint lowerRange = (ethAmount / 100) * (100 - range);
            uint upperRange = (ethAmount / 100) * (100 + range);
            if( predictedAmount >= lowerRange  && predictedAmount <= upperRange  ){
                // save all address that 
                rewardersAddress.push(rewardReciver);
            }
            
        }

        if(rewardersAddress.length>0){
            uint rewardAmount = stakeAmount / rewardersAddress.length;
            for (uint i=0; i<rewardersAddress.length; i++) {
                address payable winner = payable(rewardersAddress[i]);
                winner.transfer(rewardAmount);
            }
        }
    }
    function contractBalance() public  view returns (uint256){
        return address(this).balance;
    }
    function setTime(uint256 start, uint256 end) onlyOwner external {
        require(openingTime >= block.timestamp, "opening time must be greater current time");
        require(openingTime < closeTime, "close time must be greater than opening time");

        openingTime = start;
        closeTime = end;

    }
     

}
