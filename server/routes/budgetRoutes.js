const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
    createBudget,
    getBudgets,
    updateBudget,
    deleteBudget
} = require("../controllers/budgetController");


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const protect =
    require("../middleware/auth");


// ==========================================
// BUDGET ROUTES
// ==========================================

// CREATE BUDGET

router.post(
    "/",
    protect,
    createBudget
);


// GET ALL USER BUDGETS

router.get(
    "/",
    protect,
    getBudgets
);


// UPDATE BUDGET

router.put(
    "/:id",
    protect,
    updateBudget
);


// DELETE BUDGET

router.delete(
    "/:id",
    protect,
    deleteBudget
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;