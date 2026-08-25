// Centralized error handler

const errorHandler = function (err, req, res, next) {

    console.error("Error:", err.message);


    // Default status code
    const statusCode = res.statusCode === 200
        ? 500
        : res.statusCode;


    res.status(statusCode).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

};


module.exports = errorHandler;