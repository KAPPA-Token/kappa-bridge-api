const BigNumber = require('bignumber.js')
const fs = require('fs')

const web3 = require('../web3')
const ServerService = require('./server.service')
const { SlimeRouter } = require('../constants/token')

class ChainService {
	async init() {
		this.latestBlockNumber = parseInt(fs.readFileSync('block.json', 'utf-8'))

		if (!this.latestBlockNumber) {
			this.latestBlockNumber = await web3.eth.getBlockNumber()
		}
	}

	async listenDepositEvent() {
		try {
			const events = await SlimeRouter.getPastEvents('allEvents', {
				fromBlock: this.latestBlockNumber,
				toBlock: 'latest',
			})

			for (const e of events) {
				const { returnValues: args, event } = e

				if (args.serverId === '0') {
					if (event === 'Deposit') {
						await ServerService.deposit(args.nickname, new BigNumber(args.amount).div(10**9))
					}

					if (event === 'Withdraw') {
						await ServerService.withdraw(args.nickname, new BigNumber(args.amount).div(10**9))
					}
				}

				this.latestBlockNumber = e.blockNumber + 1
			}
		} catch (err) {
			console.log(err)
		}

		fs.writeFileSync('block.json', `${this.latestBlockNumber}`)

		setTimeout(() => this.listenDepositEvent(), 2500)
	}
}

module.exports = ChainService
