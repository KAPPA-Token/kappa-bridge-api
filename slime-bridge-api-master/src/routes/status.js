const router = require('express').Router()

// Constants
const { HOST, PORT } = require('../constants') 

// Services
const ServerService = require('../services/server.service')

router.get('/', async (req, res, next) => {
    try {
    	const status = await ServerService.getServerInfo(HOST, PORT)
    	const { description, players, version } = status

        res.result({
        	description,
        	players: {
        		max: players.max,
        		online: players.online,
        		nicknames: players.sample.map(({ name }) => name)
        	},
        	version: {
				name: version.name,
				protocol: version.protocol,
				version: version.name.replace(/Spigot/gi, '').trim(),
			},
        })
    } catch (err) {
        next(err)
    }
})

module.exports = router
