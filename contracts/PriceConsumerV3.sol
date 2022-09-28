// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceAggregator {
    function getLatestPrice(address _aggregator)
        public
        view
        returns (int price, uint8 decimals)
    {
        require(
            _aggregator != address(0),
            "PriceAggregator: Aggregator address cannot be the zero address"
        );

        AggregatorV3Interface aggregator = AggregatorV3Interface(_aggregator);

        (, price, , , ) = aggregator.latestRoundData();
        decimals = aggregator.decimals();
    }
}