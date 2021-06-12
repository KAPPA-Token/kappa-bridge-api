const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

// Middlewares
const handleErrors = require('./middlewares/handleErrors')
const limiter = require('./middlewares/rateLimit')

// Routes
const healthRoute = require('./routes/health')
const serverStatusRoute = require('./routes/status')
const serverRoute = require('./routes/server')

const app = express()

// Middlewares
app.use(cors())
app.use(helmet({
    contentSecurityPolicy: {
        reportOnly: true,
    },
}))
app.use(express.json())
app.use((req, res, next) => {
    res.result = data => res.json({
        status: 'success',
        data
    })

    return next()
})

// Routes
app.use('/api/v1', limiter(), healthRoute)
app.use('/api/v1/status', limiter(), serverStatusRoute)
app.use('/api/v1/server', limiter(), serverRoute)

app.use(handleErrors)

module.exports = app
