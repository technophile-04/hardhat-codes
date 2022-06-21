// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error FundMe__NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    // Immutables and constant are not stored insied a storage slot instead they are stored in bytecode itself
    uint256 public constant MIN_USD = 50 * 1e18;
    address public immutable i_owner;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;
    AggregatorV3Interface public priceFeed;

    modifier onlyOwner() {
        // The string is stored in string array
        // require(msg.sender == i_owner, "Not owner of the contract");

        // Hence we dont store array of string
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address _priceFeed) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        // msg.value.getConversionRate(); msg.value becomes first parameter of the function
        require(
            msg.value.getConversionRate(priceFeed) >= MIN_USD,
            "Price is lower, send more"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        /* Reset mapping */
        for (uint256 i = 0; i < funders.length; i++) {
            address currAddress = funders[i];
            addressToAmountFunded[currAddress] = 0;
        }

        /* Reseting the array to point to new location and intial element 0 */
        funders = new address[](0);

        // msg.sender = address
        // paybale(msg.sender) = paybale address;

        (bool callSuccess, ) = payable(i_owner).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call falied ");
    }

    function cheaperWithdraw() public payable {
        address[] memory m_funders = funders;

        for (uint256 i = 0; i < m_funders.length; i++) {
            address currAddress = m_funders[i];
            addressToAmountFunded[currAddress] = 0;
        }

        funders = new address[](0);

        (bool callSuccess, ) = payable(i_owner).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call falied ");
    }

    /* 
        A contract receiving Ether must have at least one of the functions below
        receive() external payable
        fallback() external payable
        receive() is called if msg.data is empty, otherwise fallback() is called.
    */

    /*                
            send Ether
               |
         msg.data is empty?
              / \
            yes  no
            /     \
receive() exists?  fallback()
         /   \
        yes   no
        /      \
    receive()   fallback() 
    */
}
