const ApiError = require('../utils/ApiError')

const errorHandler = (err, req, res, next) => {

    if (err instanceof ApiError) {
        return res.status(err.status).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details
            }
        });
        
    }
    console.error("Unhandled error:", err);
    return res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Щось пішло не так на сервері"
        }
    });
};
module.exports = errorHandler;
