// ==========================================
// PROFESSIONAL EXPENSE TRACKER
// REPORT ROUTES
// ==========================================

const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLERS
// ==========================================

const {
    getReportSummary,
    getCategoryReport,
    getMonthlyReport
} = require("../controllers/reportController");


// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const protect = require("../middleware/auth");


// ==========================================
// GET REPORT SUMMARY
// ==========================================
//
// GET /api/reports/summary
//
// Optional:
// ?from=2026-08-01&to=2026-08-31
//
// ==========================================

router.get(
    "/summary",
    protect,
    getReportSummary
);


// ==========================================
// GET CATEGORY REPORT
// ==========================================
//
// GET /api/reports/category
//
// Optional:
// ?from=2026-08-01&to=2026-08-31
//
// ==========================================

router.get(
    "/category",
    protect,
    getCategoryReport
);


// ==========================================
// GET MONTHLY REPORT
// ==========================================
//
// GET /api/reports/monthly
//
// Optional:
// ?from=2026-01-01&to=2026-12-31
//
// ==========================================

router.get(
    "/monthly",
    protect,
    getMonthlyReport
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;