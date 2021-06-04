const Web3 = require('web3')

const web3 = new Web3(process.env.BSC_HTTP_NODE)

module.exports = web3
