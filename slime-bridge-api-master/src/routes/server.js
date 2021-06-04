const router = require('express').Router()
const BigNumber = require('bignumber.js')

// Services
const ServerService = require('../services/server.service')

const { BadRequest } = require('../utils/errors')

const web3 = require('../web3')
const { SlimeRouter, SlimeRouterAddress } = require('../constants/token')

const serverCurrencyRate = 1000

router.post('/withdraw', async (req, res, next) => {
    try {
        const { serverId, wallet, nickname, amount: requestedAmount } = req.body

        const serverBalance = await ServerService.balanceOf(nickname)

        const amount = new BigNumber(requestedAmount)
        const balance = new BigNumber(serverBalance)

        const newBalance = balance.minus(amount)

        if (newBalance.lt(0)) {
            throw new BadRequest('Insufficient funds on the game balance')
        }

        const tx = {
          from: process.env.OWNER_WALLET_ADDRESS,
          to: SlimeRouterAddress,
          gas: 100000,
          data: SlimeRouter.methods
            .withdraw(serverId, wallet, nickname, amount.times(10**9).times(serverCurrencyRate))
            .encodeABI() 
        }

        const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.WALLET_PRIVATE_KEY)

        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction)

        sentTx.on('receipt', receipt => {
            res.result({ newBalance, receipt })
        })

        sentTx.on('error', err => {
            throw new Error(err)
        })
    } catch (err) {
        next(err)
    }
})

router.post('/balance', async (req, res, next) => {
    try {
        const { nickname } = req.body

        const balance = await ServerService.balanceOf(nickname)

        res.result({ balance })
    } catch (err) {
        next(err)
    }
})

module.exports = router
