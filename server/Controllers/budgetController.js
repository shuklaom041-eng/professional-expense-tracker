const Budget = require("../models/Budget");


// ==========================================
// CREATE BUDGET
// ==========================================

const createBudget = async (req, res) => {

    try {

        const {
            type,
            category,
            month,
            year,
            amount
        } = req.body;


        // ======================================
        // VALIDATION
        // ======================================

        if (
            !type ||
            !month ||
            !year ||
            amount === undefined
        ) {

            return res.status(400).json({

                message:
                    "Type, month, year and amount are required."

            });

        }


        // ======================================
        // VALIDATE TYPE
        // ======================================

        if (
            type !== "monthly" &&
            type !== "category"
        ) {

            return res.status(400).json({

                message:
                    "Budget type must be monthly or category."

            });

        }


        // ======================================
        // CATEGORY REQUIRED FOR CATEGORY BUDGET
        // ======================================

        if (
            type === "category" &&
            !category
        ) {

            return res.status(400).json({

                message:
                    "Category is required for category budget."

            });

        }


        // ======================================
        // AMOUNT VALIDATION
        // ======================================

        if (
            Number(amount) <= 0
        ) {

            return res.status(400).json({

                message:
                    "Budget amount must be greater than 0."

            });

        }


        // ======================================
        // MONTH VALIDATION
        // ======================================

        if (
            Number(month) < 1 ||
            Number(month) > 12
        ) {

            return res.status(400).json({

                message:
                    "Month must be between 1 and 12."

            });

        }


        // ======================================
        // CHECK EXISTING BUDGET
        // ======================================

        const existingBudget =
            await Budget.findOne({

                user: req.user._id,

                type,

                category:
                    type === "category"
                        ? category
                        : null,

                month,

                year

            });


        if (existingBudget) {

            return res.status(400).json({

                message:
                    "A budget already exists for this period."

            });

        }


        // ======================================
        // CREATE BUDGET
        // ======================================

        const budget =
            await Budget.create({

                user:
                    req.user._id,

                type,

                category:
                    type === "category"
                        ? category
                        : null,

                month,

                year,

                amount

            });


        // ======================================
        // RESPONSE
        // ======================================

        res.status(201).json({

            message:
                "Budget created successfully.",

            budget

        });

    } catch (error) {

        console.error(
            "Create budget error:",
            error
        );


        res.status(500).json({

            message:
                "Server error while creating budget."

        });

    }

};


// ==========================================
// GET USER BUDGETS
// ==========================================

const getBudgets = async (req, res) => {

    try {

        const budgets =
            await Budget.find({

                user:
                    req.user._id

            }).sort({

                year: -1,

                month: -1

            });


        res.status(200).json({

            budgets

        });

    } catch (error) {

        console.error(
            "Get budgets error:",
            error
        );


        res.status(500).json({

            message:
                "Server error while fetching budgets."

        });

    }

};


// ==========================================
// UPDATE BUDGET
// ==========================================

const updateBudget = async (req, res) => {

    try {

        const {
            amount
        } = req.body;


        // ======================================
        // VALIDATION
        // ======================================

        if (
            amount === undefined ||
            Number(amount) <= 0
        ) {

            return res.status(400).json({

                message:
                    "Budget amount must be greater than 0."

            });

        }


        // ======================================
        // FIND USER BUDGET
        // ======================================

        const budget =
            await Budget.findOne({

                _id:
                    req.params.id,

                user:
                    req.user._id

            });


        if (!budget) {

            return res.status(404).json({

                message:
                    "Budget not found."

            });

        }


        // ======================================
        // UPDATE
        // ======================================

        budget.amount =
            Number(amount);


        await budget.save();


        res.status(200).json({

            message:
                "Budget updated successfully.",

            budget

        });

    } catch (error) {

        console.error(
            "Update budget error:",
            error
        );


        res.status(500).json({

            message:
                "Server error while updating budget."

        });

    }

};


// ==========================================
// DELETE BUDGET
// ==========================================

const deleteBudget = async (req, res) => {

    try {

        const budget =
            await Budget.findOne({

                _id:
                    req.params.id,

                user:
                    req.user._id

            });


        if (!budget) {

            return res.status(404).json({

                message:
                    "Budget not found."

            });

        }


        await Budget.deleteOne({

            _id:
                budget._id

        });


        res.status(200).json({

            message:
                "Budget deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete budget error:",
            error
        );


        res.status(500).json({

            message:
                "Server error while deleting budget."

        });

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    createBudget,

    getBudgets,

    updateBudget,

    deleteBudget

};