const router = require('express').Router()

router.get('/', (req, res, next) => {
    try {
        res.json({ status: 'Yes' })
    } catch (err) {
        next(err)
    }
})

module.exports = router
