const express =
    require("express");


const router =
    express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
    getFinancialReport
} =
    require(
        "../controllers/reportController"
    );


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const protect =
    require(
        "../middleware/auth"
    );


// ==========================================
// FINANCIAL REPORT
// ==========================================

router.get(
    "/",
    protect,
    getFinancialReport
);


// ==========================================
// EXPORT
// ==========================================

module.exports =
    router;