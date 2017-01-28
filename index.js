const express = require('express')
const Web3 = require('web3')
const request = require('request')
const bodyParser = require('body-parser')

const DroneNoOraclize = require("./DroneNoOraclize.sol.js")

const ETH_URL = "http://localhost:8545"
const web3 = new Web3(new Web3.providers.HttpProvider(ETH_URL))

const GROUND_PUBLIC_KEY = web3.eth.accounts[1]
const PORT = 3232
const ipfsAPI = require('ipfs-api')

var ipfs = ipfsAPI('localhost', '5001', {
	protocol: 'http'
})

const app = express();
app.use(bodyParser.json())

const drone = require('../drone')

function handleLanded(e) {
	ipfs.util.addFromFs('./images/' + drone.imageFileName).then(ipfsHash => {
		console.log(ipfsHash)
		d.resetState(ipfsHash, {
			from: GROUND_PUBLIC_KEY
		}).then(r => {
			return res.send("drone ready for next mission")
		}).catch(e => {
			return res.send("error ending flight: " + e)
		})
	}).catch(err => {
		return res.send("error pushing to ipfs: " +  err)
	})

}

app.listen(PORT, () => {
	console.log("Ground station started!")
})

var d = DroneNoOraclize.deployed()

DroneNoOraclize.setProvider(web3.currentProvider);

var events = d.flightRequest({}, {
	fromBlock: 'latest',
	toBlock: 'latest'
})
events.watch(function(error, result) {
	if(error) return console.log(error)
	if(result.args.acceptedOrNot === 'accepted') return drone.startMission();
});