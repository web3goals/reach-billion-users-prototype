// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IERC20Mintable.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract Exchanger is Ownable {
    IERC20Mintable public quoteTokenContract;
    IPyth public pythContract;
    bytes32 public pythPriceFeedId;
    PythStructs.Price public price;

    constructor(
        address _quoteTokenContract,
        address _pythContract,
        bytes32 _pythPriceFeedId
    ) Ownable(msg.sender) {
        quoteTokenContract = IERC20Mintable(_quoteTokenContract);
        pythContract = IPyth(_pythContract);
        pythPriceFeedId = _pythPriceFeedId;
    }

    function setPrice(PythStructs.Price memory _price) public onlyOwner {
        price = _price;
    }

    function updatePrice(
        bytes[] calldata _pythPriceFeedsUpdateData
    ) public payable onlyOwner {
        uint fee = pythContract.getUpdateFee(_pythPriceFeedsUpdateData);
        pythContract.updatePriceFeeds{value: fee}(_pythPriceFeedsUpdateData);
        price = pythContract.getPrice(pythPriceFeedId);
    }

    function sell(uint _baseTokenAmount) public {
        require(price.price > 0, "Price is zero");
        uint quoteTokenAmount = (uint64(price.price) * _baseTokenAmount) /
            10 ** uint32(-1 * price.expo);
        quoteTokenContract.mint(quoteTokenAmount, msg.sender);
    }
}
