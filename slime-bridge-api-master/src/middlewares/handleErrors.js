const { GeneralError } = require('../utils/errors')

const handleErrors = (err, req, res, next) => {
	if (err instanceof GeneralError) {
		const code = err.getCode()

		return res.status(code).json({
			status: 'error',
			code,
			message: err.message,
		})
	}

	const code = err.status || 500

	return res.status(code).json({
		status: 'error',
		code,
		message: err.message,
	})
}

module.exports = handleErrors
