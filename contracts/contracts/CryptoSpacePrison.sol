// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CryptoSpacePrison {
    struct Cell {
        uint pickpocketAmount;
        uint conmanAmount;
    }

    address payable private _owner;
    address _paymentToken;
    uint private _pickpocketCost;
    uint private _conmanCost;
    mapping(address account => Cell cell) private _cells;

    constructor(address paymentToken, uint pickpocketCost, uint conmanCost) {
        _paymentToken = paymentToken;
        _pickpocketCost = pickpocketCost;
        _conmanCost = conmanCost;
        _owner = payable(msg.sender);
    }

    function mintPickpocket() public {
        _makePayment(_pickpocketCost);
        _cells[msg.sender].pickpocketAmount += 1;
    }

    function mintConman() public {
        _makePayment(_conmanCost);
        _cells[msg.sender].conmanAmount += 1;
    }

    function getPaymentToken() public view returns (address paymentToken) {
        return _paymentToken;
    }

    function getCell(address account) public view returns (Cell memory cell) {
        return _cells[account];
    }

    function getCosts()
        public
        view
        returns (uint pickpocketCost, uint conmanCost)
    {
        return (_pickpocketCost, _conmanCost);
    }

    function withdraw() public {
        require(msg.sender == _owner, "Not the owner");
        _owner.transfer(address(this).balance);
    }

    function _makePayment(uint cost) internal {
        if (cost == 0) {
            return;
        }
        // Check allowance
        require(
            IERC20(_paymentToken).allowance(msg.sender, address(this)) >= cost,
            "Low allowance"
        );
        // Check balance
        require(
            IERC20(_paymentToken).balanceOf(msg.sender) >= cost,
            "Low balance"
        );
        // Transfer tokens
        require(
            IERC20(_paymentToken).transferFrom(msg.sender, address(this), cost),
            "Failed to transfer"
        );
    }
}
