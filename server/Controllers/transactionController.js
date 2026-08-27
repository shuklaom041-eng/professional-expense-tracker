// Transaction controller

const Transaction = require("../models/transaction");


// ==========================================
// CREATE TRANSACTION
// ==========================================

const createTransaction = async function (req, res) {

    try {

        const {
            title,
            amount,
            type,
            category,
            description,
            date
        } = req.body;


        // Basic validation
        if (!title || !amount || !type || !category) {

            return res.status(400).json({
                success: false,
                message:
                    "Title, amount, type and category are required"
            });

        }


        // Create transaction
        const transaction =
            await Transaction.create({

                user: req.user._id,

                title: title,

                amount: amount,

                type: type,

                category: category,

                description: description,

                date: date

            });


        res.status(201).json({

            success: true,

            message:
                "Transaction created successfully",

            transaction: transaction

        });


    } catch (error) {

        console.error(
            "Create transaction error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error while creating transaction"

        });

    }

};


// ==========================================
// GET USER TRANSACTIONS
// ==========================================

const getTransactions = async function (req, res) {

    try {

        const transactions =
            await Transaction.find({

                user: req.user._id

            }).sort({

                date: -1

            });


        res.status(200).json({

            success: true,

            count: transactions.length,

            transactions: transactions

        });


    } catch (error) {

        console.error(
            "Get transactions error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error while fetching transactions"

        });

    }

};


// ==========================================
// UPDATE TRANSACTION
// ==========================================

const updateTransaction = async function (req, res) {

    try {

        const transactionId =
            req.params.id;


        const {
            title,
            amount,
            type,
            category,
            description,
            date
        } = req.body;


        // Find user's transaction
        const transaction =
            await Transaction.findOne({

                _id: transactionId,

                user: req.user._id

            });


        if (!transaction) {

            return res.status(404).json({

                success: false,

                message:
                    "Transaction not found"

            });

        }


        // Update provided fields
        if (title !== undefined) {

            transaction.title = title;

        }


        if (amount !== undefined) {

            transaction.amount = amount;

        }


        if (type !== undefined) {

            transaction.type = type;

        }


        if (category !== undefined) {

            transaction.category = category;

        }


        if (description !== undefined) {

            transaction.description =
                description;

        }


        if (date !== undefined) {

            transaction.date = date;

        }


        // Save transaction
        await transaction.save();


        res.status(200).json({

            success: true,

            message:
                "Transaction updated successfully",

            transaction: transaction

        });


    } catch (error) {

        console.error(
            "Update transaction error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error while updating transaction"

        });

    }

};


// ==========================================
// DELETE TRANSACTION
// ==========================================

const deleteTransaction = async function (req, res) {

    try {

        const transactionId =
            req.params.id;


        // Find user's transaction
        const transaction =
            await Transaction.findOne({

                _id: transactionId,

                user: req.user._id

            });


        if (!transaction) {

            return res.status(404).json({

                success: false,

                message:
                    "Transaction not found"

            });

        }


        // Delete transaction
        await Transaction.findByIdAndDelete(
            transactionId
        );


        res.status(200).json({

            success: true,

            message:
                "Transaction deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete transaction error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error while deleting transaction"

        });

    }

};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {

    createTransaction,

    getTransactions,

    updateTransaction,

    deleteTransaction

};