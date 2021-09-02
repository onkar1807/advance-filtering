const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    console.log(err);

    const error = {...err};

    error.message = err.message;

    if(err.name == "CastError") {
        const message = "Resources not found";
        error = new ErrorResponse(message, 403);
    }

    if(err.code == 11000) {
        const message = "Duplicate field value enterd";
        error = new ErrorResponse(message, 400);
    }

    if(err.name === "ValidationError") {
        const message = Object.values(err.errors)
        .map(error => error.message)
        .join(",")

        error = new ErrorResponse(message, 400);
    }

    res.staus(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server error"
    })
}

module.exports = errorHandler;