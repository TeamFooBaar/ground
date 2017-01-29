const express = require('express')
const Web3 = require('web3')
const request = require('request')
const bodyParser = require('body-parser')

const Drone = require("./Drone.sol.js")

const ETH_URL = "http://localhost:8545"
const web3 = new Web3(new Web3.providers.HttpProvider(ETH_URL))

console.log(web3.eth.accounts)

const GROUND_PUBLIC_KEY = web3.eth.accounts[0]
const PORT = 3232
const ipfsAPI = require('ipfs-api')

var ipfs = ipfsAPI('localhost', '5001', {
	protocol: 'http'
})

const app = express();
app.use(bodyParser.json())

const drone = require('../drone')

drone.on("endMission", handleResult)

function handleResult(e) {

	ipfs.util.addFromFs('./images/' + drone.imageFileName).then(results => {
		var ipfsHash = results[0].hash
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

var d = Drone.at("0xf5Fe6d14876Ee366420fFc6cb597dfbc5E2dd1D5")

Drone.setProvider(web3.currentProvider);

var events = d.flightRequest({}, {
	fromBlock: 'latest',
	toBlock: 'latest'
})
events.watch(function(error, result) {
	if(error) return console.log(error)
	if(result.args.acceptedOrNot === 'accepted') return drone.startMission(result.args.to);
});