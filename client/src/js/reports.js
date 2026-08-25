// ==========================================
// PROFESSIONAL EXPENSE TRACKER
// REPORTS PAGE
// ==========================================


// ==========================================
// AUTHENTICATION
// ==========================================

if (
    typeof isAuthenticated === "function" &&
    !isAuthenticated()
) {
    window.location.href = "login.html";
}


// ==========================================
// DOM ELEMENTS
// ==========================================

const reportMonth =
    document.querySelector("#report-month");

const reportYear =
    document.querySelector("#report-year");

const generateReportButton =
    document.querySelector("#generate-report-btn");

const reportMessage =
    document.querySelector("#report-message");

const reportEmpty =
    document.querySelector("#report-empty");


// ==========================================
// SUMMARY ELEMENTS
// ==========================================

const reportIncome =
    document.querySelector("#report-income");

const reportExpenses =
    document.querySelector("#report-expenses");

const reportSavings =
    document.querySelector("#report-savings");

const reportTransactionCount =
    document.querySelector(
        "#report-transaction-count"
    );


// ==========================================
// ANALYTICS ELEMENTS
// ==========================================

const highestCategory =
    document.querySelector("#highest-category");

const highestCategoryAmount =
    document.querySelector(
        "#highest-category-amount"
    );

const averageExpense =
    document.querySelector("#average-expense");

const largestTransaction =
    document.querySelector("#largest-transaction");

const savingsRate =
    document.querySelector("#savings-rate");

const expenseRatio =
    document.querySelector("#expense-ratio");

const financialStatus =
    document.querySelector("#financial-status");

const reportPeriod =
    document.querySelector("#report-period");


// ==========================================
// CATEGORY TABLE
// ==========================================

const categoryReportBody =
    document.querySelector(
        "#category-report-body"
    );


// ==========================================
// CHART INSTANCES
// ==========================================

let reportIncomeExpenseChart = null;

let reportCategoryChart = null;


// ==========================================
// TRANSACTION DATA
// ==========================================

let allTransactions = [];


// ==========================================
// REPORT STATE
// ==========================================

let isLoadingReports = false;


// ==========================================
// INITIALIZE YEARS
// ==========================================

function initializeYears() {

    if (!reportYear) {
        return;
    }

    const currentYear =
        new Date().getFullYear();

    reportYear.innerHTML = "";

    for (
        let year = currentYear - 5;
        year <= currentYear + 1;
        year++
    ) {

        const option =
            document.createElement("option");

        option.value = year;

        option.textContent = year;

        reportYear.appendChild(option);
    }

    reportYear.value = currentYear;
}


// ==========================================
// INITIALIZE MONTH
// ==========================================

function initializeMonth() {

    if (!reportMonth) {
        return;
    }

    const currentMonth =
        new Date().getMonth() + 1;

    reportMonth.value = currentMonth;
}


// ==========================================
// SHOW REPORT MESSAGE
// ==========================================

function showReportMessage(
    message,
    isError = false
) {

    if (!reportMessage) {
        return;
    }

    reportMessage.textContent =
        message;

    reportMessage.style.color =
        isError
            ? "#dc2626"
            : "#16a34a";
}


// ==========================================
// GET TOKEN
// ==========================================

function getReportsToken() {

    if (
        typeof getToken === "function"
    ) {
        return getToken();
    }

    return (
        localStorage.getItem("token") ||
        localStorage.getItem("jwtToken") ||
        ""
    );
}


// ==========================================
// LOAD TRANSACTIONS
// ==========================================

async function loadTransactions() {

    if (isLoadingReports) {
        return;
    }

    isLoadingReports = true;

    showReportMessage(
        "Loading report data..."
    );

    try {

        const token =
            getReportsToken();

        if (!token) {

            window.location.href =
                "login.html";

            return;
        }


        // ----------------------------------
        // API BASE URL
        // ----------------------------------

        const apiBaseUrl =
            window.API_BASE_URL ||
            "http://localhost:5000/api";


        // ----------------------------------
        // REQUEST
        // ----------------------------------

        const response =
            await fetch(
                `${apiBaseUrl}/transactions`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        // ----------------------------------
        // RESPONSE
        // ----------------------------------

        let data = {};

        try {

            data =
                await response.json();

        } catch (jsonError) {

            throw new Error(
                "Server returned an invalid response."
            );
        }


        // ----------------------------------
        // AUTH FAILURE
        // ----------------------------------

        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "jwtToken"
            );

            window.location.href =
                "login.html";

            return;
        }


        // ----------------------------------
        // OTHER ERRORS
        // ----------------------------------

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load transactions."
            );
        }


        // ----------------------------------
        // TRANSACTION DATA
        // ----------------------------------

        allTransactions =
            Array.isArray(
                data.transactions
            )
                ? data.transactions
                : Array.isArray(data.data)
                    ? data.data
                    : [];


        // ----------------------------------
        // GENERATE REPORT
        // ----------------------------------

        generateReport();

    } catch (error) {

        console.error(
            "Reports transaction error:",
            error
        );

        showReportMessage(
            error.message ||
            "Failed to load report data.",
            true
        );

        showEmptyState();

    } finally {

        isLoadingReports = false;
    }
}


// ==========================================
// GET SELECTED TRANSACTIONS
// ==========================================

function getSelectedTransactions() {

    if (
        !reportMonth ||
        !reportYear
    ) {
        return [];
    }

    const month =
        Number(
            reportMonth.value
        );

    const year =
        Number(
            reportYear.value
        );


    return allTransactions.filter(
        function (transaction) {

            if (!transaction.date) {
                return false;
            }


            const date =
                new Date(
                    transaction.date
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return false;
            }


            const transactionMonth =
                date.getMonth() + 1;

            const transactionYear =
                date.getFullYear();


            return (
                transactionMonth === month &&
                transactionYear === year
            );
        }
    );
}


// ==========================================
// GENERATE REPORT
// ==========================================

function generateReport() {

    const transactions =
        getSelectedTransactions();


    const month =
        Number(
            reportMonth?.value || 0
        );

    const year =
        Number(
            reportYear?.value || 0
        );


    // ==================================
    // CALCULATE TOTALS
    // ==================================

    let income = 0;

    let expenses = 0;


    transactions.forEach(
        function (transaction) {

            const amount =
                Number(
                    transaction.amount
                );


            if (
                !Number.isFinite(amount) ||
                amount < 0
            ) {
                return;
            }


            if (
                transaction.type ===
                "income"
            ) {

                income += amount;

            } else if (
                transaction.type ===
                "expense"
            ) {

                expenses += amount;

            }
        }
    );


    const savings =
        income - expenses;


    // ==================================
    // UPDATE SUMMARY
    // ==================================

    if (reportIncome) {

        reportIncome.textContent =
            formatCurrency(income);
    }


    if (reportExpenses) {

        reportExpenses.textContent =
            formatCurrency(expenses);
    }


    if (reportSavings) {

        reportSavings.textContent =
            formatCurrency(savings);
    }


    if (reportTransactionCount) {

        reportTransactionCount.textContent =
            transactions.length;
    }


    // ==================================
    // EMPTY STATE
    // ==================================

    if (
        transactions.length === 0
    ) {

        showEmptyState();

    } else {

        hideEmptyState();
    }


    // ==================================
    // ANALYTICS
    // ==================================

    calculateAnalytics(
        transactions,
        income,
        expenses,
        savings
    );


    // ==================================
    // CHARTS
    // ==================================

    createIncomeExpenseChart(
        income,
        expenses
    );

    createCategoryChart(
        transactions
    );


    // ==================================
    // CATEGORY TABLE
    // ==================================

    createCategoryTable(
        transactions,
        expenses
    );


    // ==================================
    // REPORT PERIOD
    // ==================================

    const monthName =
        getMonthName(month);


    if (reportPeriod) {

        reportPeriod.textContent =
            `${monthName} ${year}`;
    }


    // ==================================
    // MESSAGE
    // ==================================

    if (
        transactions.length === 0
    ) {

        showReportMessage(
            `No transactions found for ${monthName} ${year}.`
        );

    } else {

        showReportMessage(
            `Report generated for ${monthName} ${year}.`
        );
    }
}


// ==========================================
// EMPTY STATE
// ==========================================

function showEmptyState() {

    if (reportEmpty) {

        reportEmpty.style.display =
            "block";
    }
}


// ==========================================
// HIDE EMPTY STATE
// ==========================================

function hideEmptyState() {

    if (reportEmpty) {

        reportEmpty.style.display =
            "none";
    }
}


// ==========================================
// FORMAT CURRENCY
// ==========================================

function formatCurrency(amount) {

    const safeAmount =
        Number(amount);


    return (
        "₹" +
        (
            Number.isFinite(safeAmount)
                ? safeAmount
                : 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    );
}


// ==========================================
// GET MONTH NAME
// ==========================================

function getMonthName(month) {

    const months = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];


    return (
        months[month - 1] ||
        "Unknown"
    );
}


// ==========================================
// ANALYTICS
// ==========================================

function calculateAnalytics(
    transactions,
    income,
    expenses,
    savings
) {

    // ==================================
    // EXPENSE TRANSACTIONS
    // ==================================

    const expenseTransactions =
        transactions.filter(
            function (transaction) {

                return (
                    transaction.type ===
                    "expense"
                );
            }
        );


    // ==================================
    // CATEGORY TOTALS
    // ==================================

    const categoryTotals = {};


    expenseTransactions.forEach(
        function (transaction) {

            const category =
                transaction.category &&
                String(
                    transaction.category
                ).trim()
                    ? String(
                        transaction.category
                    ).trim()
                    : "Other";


            const amount =
                Number(
                    transaction.amount
                );


            if (
                !Number.isFinite(amount) ||
                amount < 0
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


    // ==================================
    // HIGHEST CATEGORY
    // ==================================

    let highestCategoryName =
        "—";

    let highestAmount =
        0;


    Object.entries(
        categoryTotals
    ).forEach(
        function (
            [category, amount]
        ) {

            if (
                amount >
                highestAmount
            ) {

                highestAmount =
                    amount;

                highestCategoryName =
                    category;
            }
        }
    );


    if (highestCategory) {

        highestCategory.textContent =
            highestCategoryName;
    }


    if (highestCategoryAmount) {

        highestCategoryAmount.textContent =
            formatCurrency(
                highestAmount
            );
    }


    // ==================================
    // AVERAGE EXPENSE
    // ==================================

    let average =
        0;


    if (
        expenseTransactions.length > 0
    ) {

        average =
            expenses /
            expenseTransactions.length;
    }


    if (averageExpense) {

        averageExpense.textContent =
            formatCurrency(
                average
            );
    }


    // ==================================
    // LARGEST TRANSACTION
    // ==================================

    let largest =
        0;


    transactions.forEach(
        function (transaction) {

            const amount =
                Number(
                    transaction.amount
                );


            if (
                Number.isFinite(amount) &&
                amount > largest
            ) {

                largest =
                    amount;
            }
        }
    );


    if (largestTransaction) {

        largestTransaction.textContent =
            formatCurrency(
                largest
            );
    }


    // ==================================
    // SAVINGS RATE
    // ==================================

    let savingPercentage =
        0;


    if (income > 0) {

        savingPercentage =
            (
                savings /
                income
            ) * 100;
    }


    if (savingsRate) {

        savingsRate.textContent =
            `${savingPercentage.toFixed(2)}%`;
    }


    // ==================================
    // EXPENSE RATIO
    // ==================================

    let expensePercentage =
        0;


    if (income > 0) {

        expensePercentage =
            (
                expenses /
                income
            ) * 100;
    }


    if (expenseRatio) {

        expenseRatio.textContent =
            `${expensePercentage.toFixed(2)}%`;
    }


    // ==================================
    // FINANCIAL STATUS
    // ==================================

    let status =
        "No Data";


    if (
        transactions.length === 0
    ) {

        status =
            "No Data";

    } else if (
        income === 0 &&
        expenses > 0
    ) {

        status =
            "Needs Attention";

    } else if (
        expenses > income
    ) {

        status =
            "Overspending";

    } else if (
        savings > 0
    ) {

        status =
            "Healthy";

    } else if (
        savings === 0
    ) {

        status =
            "Balanced";

    } else {

        status =
            "Needs Attention";
    }


    if (financialStatus) {

        financialStatus.textContent =
            status;
    }
}


// ==========================================
// INCOME VS EXPENSE CHART
// ==========================================

function createIncomeExpenseChart(
    income,
    expenses
) {

    const canvas =
        document.querySelector(
            "#report-income-expense-chart"
        );


    if (!canvas) {
        return;
    }


    // ----------------------------------
    // CHART.JS CHECK
    // ----------------------------------

    if (
        typeof Chart === "undefined"
    ) {

        console.error(
            "Chart.js is not loaded."
        );

        return;
    }


    // ----------------------------------
    // DESTROY OLD CHART
    // ----------------------------------

    if (
        reportIncomeExpenseChart
    ) {

        reportIncomeExpenseChart.destroy();

        reportIncomeExpenseChart =
            null;
    }


    // ----------------------------------
    // CREATE CHART
    // ----------------------------------

    reportIncomeExpenseChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Income",
                        "Expenses"
                    ],

                    datasets: [

                        {

                            label:
                                "Amount (₹)",

                            data: [
                                income,
                                expenses
                            ],

                            borderWidth: 1

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            beginAtZero: true

                        }

                    }

                }

            }
        );
}


// ==========================================
// CATEGORY CHART
// ==========================================

function createCategoryChart(
    transactions
) {

    const canvas =
        document.querySelector(
            "#report-category-chart"
        );


    if (!canvas) {
        return;
    }


    if (
        typeof Chart === "undefined"
    ) {

        console.error(
            "Chart.js is not loaded."
        );

        return;
    }


    // ----------------------------------
    // CATEGORY TOTALS
    // ----------------------------------

    const categoryTotals = {};


    transactions.forEach(
        function (transaction) {

            if (
                transaction.type !==
                "expense"
            ) {
                return;
            }


            const category =
                transaction.category &&
                String(
                    transaction.category
                ).trim()
                    ? String(
                        transaction.category
                    ).trim()
                    : "Other";


            const amount =
                Number(
                    transaction.amount
                );


            if (
                !Number.isFinite(amount) ||
                amount < 0
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


    const categories =
        Object.keys(
            categoryTotals
        );


    const amounts =
        Object.values(
            categoryTotals
        );


    // ----------------------------------
    // DESTROY OLD CHART
    // ----------------------------------

    if (
        reportCategoryChart
    ) {

        reportCategoryChart.destroy();

        reportCategoryChart =
            null;
    }


    // ----------------------------------
    // EMPTY DATA
    // ----------------------------------

    if (
        categories.length === 0
    ) {
        return;
    }


    // ----------------------------------
    // CREATE CHART
    // ----------------------------------

    reportCategoryChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels:
                        categories,

                    datasets: [

                        {

                            label:
                                "Expenses",

                            data:
                                amounts,

                            borderWidth: 1

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );
}


// ==========================================
// CATEGORY TABLE
// ==========================================

function createCategoryTable(
    transactions,
    totalExpenses
) {

    if (!categoryReportBody) {
        return;
    }


    categoryReportBody.innerHTML =
        "";


    const categoryData = {};


    transactions.forEach(
        function (transaction) {

            if (
                transaction.type !==
                "expense"
            ) {
                return;
            }


            const category =
                transaction.category &&
                String(
                    transaction.category
                ).trim()
                    ? String(
                        transaction.category
                    ).trim()
                    : "Other";


            const amount =
                Number(
                    transaction.amount
                );


            if (
                !Number.isFinite(amount) ||
                amount < 0
            ) {
                return;
            }


            if (
                !categoryData[category]
            ) {

                categoryData[category] = {

                    amount: 0,

                    count: 0

                };
            }


            categoryData[category].amount +=
                amount;

            categoryData[category].count++;
        }
    );


    // ----------------------------------
    // SORT
    // ----------------------------------

    const entries =
        Object.entries(
            categoryData
        ).sort(
            function (a, b) {

                return (
                    b[1].amount -
                    a[1].amount
                );
            }
        );


    // ----------------------------------
    // EMPTY TABLE
    // ----------------------------------

    if (
        entries.length === 0
    ) {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `
            <td colspan="4">
                No expense data available.
            </td>
        `;


        categoryReportBody.appendChild(
            row
        );

        return;
    }


    // ----------------------------------
    // CREATE ROWS
    // ----------------------------------

    entries.forEach(
        function (
            [category, data]
        ) {

            const percentage =
                totalExpenses > 0
                    ? (
                        data.amount /
                        totalExpenses
                    ) * 100
                    : 0;


            const row =
                document.createElement(
                    "tr"
                );


            // textContent is used instead of
            // directly inserting user data
            // into HTML.

            const categoryCell =
                document.createElement(
                    "td"
                );

            categoryCell.textContent =
                category;


            const amountCell =
                document.createElement(
                    "td"
                );

            amountCell.textContent =
                formatCurrency(
                    data.amount
                );


            const countCell =
                document.createElement(
                    "td"
                );

            countCell.textContent =
                data.count;


            const percentageCell =
                document.createElement(
                    "td"
                );

            percentageCell.textContent =
                `${percentage.toFixed(2)}%`;


            row.appendChild(
                categoryCell
            );

            row.appendChild(
                amountCell
            );

            row.appendChild(
                countCell
            );

            row.appendChild(
                percentageCell
            );


            categoryReportBody.appendChild(
                row
            );
        }
    );
}


// ==========================================
// GENERATE REPORT BUTTON
// ==========================================

if (
    generateReportButton
) {

    generateReportButton.addEventListener(
        "click",
        function () {

            generateReport();

        }
    );
}


// ==========================================
// MONTH/YEAR CHANGE
// ==========================================

if (reportMonth) {

    reportMonth.addEventListener(
        "change",
        generateReport
    );
}


if (reportYear) {

    reportYear.addEventListener(
        "change",
        generateReport
    );
}


// ==========================================
// CLEANUP CHARTS
// ==========================================

window.addEventListener(
    "beforeunload",
    function () {

        if (
            reportIncomeExpenseChart
        ) {

            reportIncomeExpenseChart.destroy();
        }


        if (
            reportCategoryChart
        ) {

            reportCategoryChart.destroy();
        }

    }
);


// ==========================================
// INITIALIZE REPORT PAGE
// ==========================================

initializeYears();

initializeMonth();

loadTransactions();