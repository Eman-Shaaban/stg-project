// Error Handler middleware
const errorHandler = (error, req, res, next) => {
    if (!error) return next()
    const payload = {
        status: error.status,
        message: error.message,
        stack: error.stack
    }
    return res.status(error?.output?.statusCode || 500).json(payload)
}



module.exports = errorHandler