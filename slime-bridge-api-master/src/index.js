require('dotenv').config()
const http = require('http')

const app = require('./app')
const ServerService = require('./services/server.service')
const ChainService = require('./services/chain.service')

const port = process.env.PORT || 3000
const server = http.createServer(app)

const run = async () => {
    await ServerService.connect()

    const chainService = new ChainService()

    await chainService.init()

    chainService.listenDepositEvent()

    server.listen(port, () => {
        console.log(`API is running on ${port}`)
    })
}

run()