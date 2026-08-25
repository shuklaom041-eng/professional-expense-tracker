// ==========================================
// PROFESSIONAL EXPENSE TRACKER
// REPORT CONTROLLER
// ==========================================

const Transaction = require("../models/Transaction");


// ==========================================
// HELPER — BUILD DATE FILTER
// ==========================================

const buildDateFilter = (from, to) => {

    const dateFilter = {};

    // ------------------------------
    // FROM DATE
    // ------------------------------

    if (from) {

        const fromDate = new Date(from);

        if (Number.isNaN(fromDate.getTime())) {
            throw new Error("Invalid from date.");
        }

        fromDate.setHours(0, 0, 0, 0);

        dateFilter.$gte = fromDate;
    }


    // ------------------------------
    // TO DATE
    // ------------------------------

    if (to) {

        const toDate = new Date(to);

        if (Number.isNaN(toDate.getTime())) {
            throw new Error("Invalid to date.");
        }

        toDate.setHours(
            23,
            59,
            59,
            999
        );

        dateFilter.$lte = toDate;
    }


    return dateFilter;
};


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

const getReportSummary = async (req, res) => {

    try {

        // ----------------------------------
        // DATE FILTER
        // ----------------------------------

        const dateFilter =
            buildDateFilter(
                req.query.from,
                req.query.to
            );


        // ----------------------------------
        // QUERY
        // ----------------------------------

        const query = {

            user: req.user._id

        };


        if (
            Object.keys(dateFilter).length > 0
        ) {

            query.date = dateFilter;

        }


        // ----------------------------------
        // FETCH TRANSACTIONS
        // ----------------------------------

        const transactions =
            await Transaction.find(query)
                .sort({
                    date: -1
                });


        // ----------------------------------
        // CALCULATIONS
        // ----------------------------------

        let totalIncome = 0;

        let totalExpenses = 0;

        let incomeCount = 0;

        let expenseCount = 0;


        transactions.forEach(
            (transaction) => {

                const amount =
                    Number(
                        transaction.amount
                    );


                if (
                    !Number.isFinite(amount)
                ) {

                    return;

                }


                if (
                    transaction.type ===
                    "income"
                ) {

                    totalIncome += amount;

                    incomeCount++;

                }


                if (
                    transaction.type ===
                    "expense"
                ) {

                    totalExpenses += amount;

                    expenseCount++;

                }

            }
        );


        // ----------------------------------
        // BALANCE
        // ----------------------------------

        const balance =
            totalIncome -
            totalExpenses;


        // ----------------------------------
        // SAVINGS RATE
        // ----------------------------------

        let savingsRate = 0;


        if (totalIncome > 0) {

            savingsRate =
                (
                    balance /
                    totalIncome
                ) * 100;

        }


        // ----------------------------------
        // AVERAGES
        // ----------------------------------

        const averageIncome =
            incomeCount > 0
                ? totalIncome / incomeCount
                : 0;


        const averageExpense =
            expenseCount > 0
                ? totalExpenses / expenseCount
                : 0;


        // ----------------------------------
        // RESPONSE
        // ----------------------------------

        return res.status(200).json({

            success: true,

            data: {

                totalIncome,

                totalExpenses,

                balance,

                savingsRate:
                    Number(
                        savingsRate.toFixed(2)
                    ),

                transactionCount:
                    transactions.length,

                incomeCount,

                expenseCount,

                averageIncome:
                    Number(
                        averageIncome.toFixed(2)
                    ),

                averageExpense:
                    Number(
                        averageExpense.toFixed(2)
                    )

            }

        });

    } catch (error) {

        console.error(
            "Report Summary Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to generate report."

        });

    }

};


// ==========================================
// GET CATEGORY REPORT
// ==========================================
//
// GET /api/reports/categories
//
// Optional:
// ?from=2026-08-01&to=2026-08-31
//
// ==========================================

const getCategoryReport = async (req, res) => {

    try {

        // ----------------------------------
        // DATE FILTER
        // ----------------------------------

        const dateFilter =
            buildDateFilter(
                req.query.from,
                req.query.to
            );


        // ----------------------------------
        // QUERY
        // ----------------------------------

        const query = {

            user: req.user._id,

            type: "expense"

        };


        if (
            Object.keys(dateFilter).length > 0
        ) {

            query.date = dateFilter;

        }


        // ----------------------------------
        // FETCH EXPENSES
        // ----------------------------------

        const transactions =
            await Transaction.find(query);


        // ----------------------------------
        // CATEGORY CALCULATION
        // ----------------------------------

        const categoryTotals = {};


        transactions.forEach(
            (transaction) => {

                const category =
                    transaction.category &&
                    transaction.category.trim()
                        ? transaction.category.trim()
                        : "Other";


                const amount =
                    Number(
                        transaction.amount
                    );


                if (
                    !Number.isFinite(amount)
                ) {

                    return;

                }


                if (
                    !categoryTotals[category]
                ) {

                    categoryTotals[category] =
                        0;

                }


                categoryTotals[category] +=
                    amount;

            }
        );


        // ----------------------------------
        // SORT CATEGORIES
        // ----------------------------------

        const sortedCategories =
            Object.entries(
                categoryTotals
            )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


        // ----------------------------------
        // TOTAL EXPENSE
        // ----------------------------------

        const totalExpenses =
            sortedCategories.reduce(
                (
                    total,
                    [, amount]
                ) => {

                    return total + amount;

                },
                0
            );


        // ----------------------------------
        // RESPONSE
        // ----------------------------------

        return res.status(200).json({

            success: true,

            data: {

                categories:
                    Object.fromEntries(
                        sortedCategories
                    ),

                totalExpenses,

                categoryCount:
                    sortedCategories.length

            }

        });

    } catch (error) {

        console.error(
            "Category Report Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to generate category report."

        });

    }

};


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

const getMonthlyReport = async (req, res) => {

    try {

        // ----------------------------------
        // DATE FILTER
        // ----------------------------------

        const dateFilter =
            buildDateFilter(
                req.query.from,
                req.query.to
            );


        // ----------------------------------
        // QUERY
        // ----------------------------------

        const query = {

            user: req.user._id

        };


        if (
            Object.keys(dateFilter).length > 0
        ) {

            query.date = dateFilter;

        }


        // ----------------------------------
        // FETCH TRANSACTIONS
        // ----------------------------------

        const transactions =
            await Transaction.find(query)
                .sort({
                    date: 1
                });


        // ----------------------------------
        // MONTHLY DATA
        // ----------------------------------

        const monthlyData = {};


        transactions.forEach(
            (transaction) => {

                const transactionDate =
                    new Date(
                        transaction.date ||
                        transaction.createdAt
                    );


                if (
                    Number.isNaN(
                        transactionDate.getTime()
                    )
                ) {

                    return;

                }


                const year =
                    transactionDate.getFullYear();


                const month =
                    transactionDate.getMonth() + 1;


                const key =
                    `${year}-${String(
                        month
                    ).padStart(2, "0")}`;


                // --------------------------------
                // INITIALIZE MONTH
                // --------------------------------

                if (
                    !monthlyData[key]
                ) {

                    monthlyData[key] = {

                        income: 0,

                        expenses: 0,

                        balance: 0,

                        transactionCount: 0

                    };

                }


                // --------------------------------
                // AMOUNT
                // --------------------------------

                const amount =
                    Number(
                        transaction.amount
                    );


                if (
                    !Number.isFinite(amount)
                ) {

                    return;

                }


                monthlyData[key]
                    .transactionCount++;


                // --------------------------------
                // INCOME
                // --------------------------------

                if (
                    transaction.type ===
                    "income"
                ) {

                    monthlyData[key].income +=
                        amount;

                }


                // --------------------------------
                // EXPENSE
                // --------------------------------

                if (
                    transaction.type ===
                    "expense"
                ) {

                    monthlyData[key].expenses +=
                        amount;

                }

            }
        );


        // ----------------------------------
        // CALCULATE MONTHLY BALANCE
        // ----------------------------------

        Object.keys(
            monthlyData
        ).forEach(
            (month) => {

                monthlyData[month].balance =
                    monthlyData[month].income -
                    monthlyData[month].expenses;

            }
        );


        // ----------------------------------
        // SORT MONTHS
        // ----------------------------------

        const sortedMonthlyData =
            Object.fromEntries(
                Object.entries(
                    monthlyData
                ).sort(
                    ([monthA], [monthB]) =>
                        monthA.localeCompare(
                            monthB
                        )
                )
            );


        // ----------------------------------
        // RESPONSE
        // ----------------------------------

        return res.status(200).json({

            success: true,

            data: {

                monthlyData:
                    sortedMonthlyData,

                monthCount:
                    Object.keys(
                        sortedMonthlyData
                    ).length

            }

        });

    } catch (error) {

        console.error(
            "Monthly Report Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to generate monthly report."

        });

    }

};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {

    getReportSummary,

    getCategoryReport,

    getMonthlyReport

};