const express = require("express")
const Web3 = require('web3')

const DroneNoOraclize = require("./DroneNoOraclize.sol.js")

const ETH_URL = "http://localhost:8545"
const web3 = new Web3(new Web3.providers.HttpProvider(ETH_URL))

const GROUND_PUBLIC_KEY = web3.eth.accounts[1]
const PORT = 3232

const app = express();

app.listen(PORT, () => {
	console.log("Ground station started!")
})

var d = DroneNoOraclize.deployed()

DroneNoOraclize.setProvider(web3.currentProvider);

var events = d.flightRequest( {}, {fromBlock: 'latest', toBlock: 'latest'})
events.watch(function(error, result) {

    console.log(result)
});

