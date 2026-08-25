const mongoose = require("mongoose");


// ==========================================
// BUDGET SCHEMA
// ==========================================

const budgetSchema = new mongoose.Schema(
    {

        // ======================================
        // USER
        // ======================================

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },


        // ======================================
        // BUDGET TYPE
        // ======================================

        type: {

            type: String,

            enum: [
                "monthly",
                "category"
            ],

            required: true

        },


        // ======================================
        // CATEGORY
        // ======================================

        category: {

            type: String,

            default: null

        },


        // ======================================
        // MONTH
        // ======================================

        month: {

            type: Number,

            required: true

        },


        // ======================================
        // YEAR
        // ======================================

        year: {

            type: Number,

            required: true

        },


        // ======================================
        // BUDGET AMOUNT
        // ======================================

        amount: {

            type: Number,

            required: true,

            min: 0

        }

    },

    {
        timestamps: true
    }

);


// ==========================================
// EXPORT MODEL
// ==========================================

module.exports =
    mongoose.model(
        "Budget",
        budgetSchema
    );