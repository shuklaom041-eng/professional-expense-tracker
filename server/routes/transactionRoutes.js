const express = require("express");

const router = express.Router();

const transactionController =
    require("../Controllers/transactionController");

const protect =
    require("../middleware/auth");


// ==========================================
// CREATE TRANSACTION
// ==========================================

router.post(
    "/",
    protect,
    transactionController.createTransaction
);


// ==========================================
// GET ALL USER TRANSACTIONS
// ==========================================

router.get(
    "/",
    protect,
    transactionController.getTransactions
);


// ==========================================
// UPDATE TRANSACTION
// ==========================================

router.put(
    "/:id",
    protect,
    transactionController.updateTransaction
);


// ==========================================
// DELETE TRANSACTION
// ==========================================

router.delete(
    "/:id",
    protect,
    transactionController.deleteTransaction
);


module.exports = router;