// ==========================================
// IMPORT PACKAGES
// ==========================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

dotenv.config();


// ==========================================
// DATABASE
// ==========================================

const connectDB =
    require("./config/db");


// ==========================================
// ROUTES
// ==========================================

const authRoutes =
    require("./routes/authRoutes");

const transactionRoutes =
    require("./routes/transactionRoutes");

const userRoutes =
    require("./routes/userRoutes");

const budgetRoutes =
    require("./routes/budgetRoutes");

const reportRoutes =
    require("./routes/reportRoutes");


// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app =
    express();


// ==========================================
// CONNECT DATABASE
// ==========================================

connectDB();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors()
);

app.use(
    express.json()
);


// ==========================================
// ROOT ROUTE
// ==========================================

app.get(
    "/",
    (req, res) => {

        res.status(200).send(
            "Expense Tracker Backend Running"
        );

    }
);


// ==========================================
// AUTH ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);


// ==========================================
// TRANSACTION ROUTES
// ==========================================

app.use(
    "/api/transactions",
    transactionRoutes
);


// ==========================================
// USER ROUTES
// ==========================================

app.use(
    "/api/users",
    userRoutes
);


// ==========================================
// BUDGET ROUTES
// ==========================================

app.use(
    "/api/budgets",
    budgetRoutes
);


// ==========================================
// REPORT ROUTES
// ==========================================

app.use(
    "/api/reports",
    reportRoutes
);


// ==========================================
// 404 ROUTE
// ==========================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                `Route not found: ${req.method} ${req.originalUrl}`

        });

    }
);


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
    (err, req, res, next) => {

        console.error(
            "Server Error:",
            err
        );

        res.status(
            err.status || 500
        ).json({

            success: false,

            message:
                err.message ||
                "Internal Server Error"

        });

    }
);


// ==========================================
// PORT
// ==========================================

const PORT =
    process.env.PORT || 5000;


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);