const rateLimit = require('express-rate-limit')

const limiter = (
	windowMs = 1000, // 1 second
	maxRequests = 5, // limit each IP to 5 requests per windowMs
) => rateLimit({ windowMs, max: maxRequests })

module.exports = limiter
