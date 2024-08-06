// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract CryptoSpacePrison {
    struct Cell {
        uint pickpocketAmount;
        uint conmanAmount;
    }

    address payable public _owner;
    uint private _pickpocketCost;
    uint private _conmanCost;
    mapping(address account => Cell cell) _cells;

    constructor(uint pickpocketCost, uint conmanCost) {
        _pickpocketCost = pickpocketCost;
        _conmanCost = conmanCost;
        _owner = payable(msg.sender);
    }

    function mintPickpocket() public payable {
        require(msg.value == _pickpocketCost);
        _cells[msg.sender].pickpocketAmount += 1;
    }

    function mintConman() public payable {
        require(msg.value == _conmanCost);
        _cells[msg.sender].conmanAmount += 1;
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
}
