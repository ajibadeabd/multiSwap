//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import "./PriceConsumerV3.sol";



// This is the main building block for smart contracts.
contract EthFarm {
    // Some string type variables to identify the token.
    bytes32  public name = "The Eth Farm";
    bytes32 public symbol = "TEF";


    // 5% range Plus or minus the current price
    uint256 public rangeDeterminant = 5;

    uint256 public openingTime;
    uint256 public closeTime;
    PriceAggregator public priceConsumer;

    uint256 public stakeAmount = 0.5 ether;

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
        priceConsumer = new PriceAggregator();
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
    function price() public view  returns (uint) {
       (int bb, uint aa) = priceConsumer.getLatestPrice(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
       return  uint(bb) / (10 ** aa);
    }

    function stake(uint256 predictedPrice) public payable {

        uint256 currentTime = block.timestamp;

        if(currentTime > openingTime && currentTime > closeTime){
            revert("please check time to stake");
        }

        require(!hasStake[msg.sender], "Can't stake twice");

        require(stakeAmount ==  msg.value, "incorrect staking balance");

        predictedPrices[msg.sender] = predictedPrice;

        hasStake[msg.sender] = true;
        stakers.push(msg.sender);
    }



     function reward( ) onlyOwner external {
        // Issue tokens to all stakers
        uint ethAmount = price() * (10**18);
        uint stakersLength  = stakers.length;
        // save in state so as not to visit storage on every iteration
        address[] memory stakersCopy = stakers;

        for (uint i=0; i<stakersLength; i++) {

            address rewardReciver = stakersCopy[i];
            uint predictedAmount = predictedPrices[rewardReciver];

            uint lowerRange = (ethAmount / 100) * (100 - rangeDeterminant);
            uint upperRange = (ethAmount / 100) * (100 + rangeDeterminant);
            if( predictedAmount >= lowerRange  && predictedAmount <= upperRange  ){
                // save all address that 
                rewardersAddress.push(rewardReciver);
            }
            
        }

        if(rewardersAddress.length>0){
            uint rewardAmount = (stakeAmount * stakers.length )/ rewardersAddress.length;
            for (uint i=0; i<rewardersAddress.length; i++) {
                address payable winner = payable(rewardersAddress[i]);
                winner.transfer(rewardAmount);
            }
        }
    }
    function contractBalance() public  view returns (uint256){
        return address(this).balance;
    }

    function stakersCount() public  view returns (uint256){
        return stakers.length;
    }

    function winnersCount() public  view returns (uint256){
        return rewardersAddress.length;
    }
    function setTime(uint256 start, uint256 end) onlyOwner public {
        openingTime = start;
        require(openingTime >= block.timestamp, "opening time must be greater current time");
        require(openingTime < end, "close time must be greater than opening time");

        closeTime = end;

    }
     

}
