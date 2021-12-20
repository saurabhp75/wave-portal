// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    // Initialized to 0 by default
    uint256 noOfMessages;

    // To be initialized in constructor
    // It will change every time any user sends a message.
    uint256 private seed;

    // Define an event
    event NewWave(address indexed from, uint256 timestamp, string message);

    // Strucure to hold user's message.
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    // This array will hold all the messages ever sent.
    Wave[] waves;

    //  This is an address => uint mapping, storing the address the last time the user waved at us.
    mapping(address => uint256) public lastWavedAt;

    // Runs when contract is deployed.
    // This contract can pay to the user/Signer
    constructor() payable {
        console.log("Constructor called, Contract about to be deployed!");

        // Set the initial seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    // The string _message contains the message our user sends us from the frontend!
    function sendMessage(string memory _message) public {
        // Here msg.sender is the wallet address of the person who called this function

        /*
         * We need to make sure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
         */
        // require(
        //     lastWavedAt[msg.sender] + 30 seconds < block.timestamp,
        //     "Must wait 30 seconds before waving again."
        // );

        // Store last message send time
        lastWavedAt[msg.sender] = block.timestamp;

        noOfMessages += 1;
        console.log("%s has sent this message: %s", msg.sender, _message);

        // Store the sender's message in the array
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // prepare the seed
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        // Emit the event on message send
        emit NewWave(msg.sender, block.timestamp, _message);

        // Transfer ether to sender only if seed < 50
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;

            // Check if the contract has sufficient balance
            require(
                // 'this' refers to the contract itself
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );

            // Contract sends 'prizeAmount' of ETH to the caller of this function
            // For this to work the contract constructor should be marked payable
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");

            // Check if transfer is success
            require(success, "Failed to withdraw money from contract.");
        }
    }

    /*
     * This will return the struct array, waves, to us.
     * This will make it easy to retrieve the waves from the web app
     */
    function getAllMsgs() public view returns (Wave[] memory) {
        return waves;
    }

    function getMessagesNumber() public view returns (uint256) {
        console.log("There are now %d total messages!", noOfMessages);
        return noOfMessages;
    }
}
