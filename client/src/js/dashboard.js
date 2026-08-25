// ==========================================
// DASHBOARD AUTHENTICATION
// ==========================================

if (!isAuthenticated()) {

    window.location.href =
        "login.html";

}


// ==========================================
// DASHBOARD ELEMENTS
// ==========================================

const totalIncome =
    document.querySelector(
        "#total-income"
    );


const totalExpenses =
    document.querySelector(
        "#total-expenses"
    );


const balance =
    document.querySelector(
        "#balance"
    );


const savings =
    document.querySelector(
        "#savings"
    );


const transactionList =
    document.querySelector(
        "#dashboard-transaction-list"
    );


// ==========================================
// BUDGET ELEMENTS
// ==========================================

const dashboardBudget =
    document.querySelector(
        "#dashboard-budget"
    );


const dashboardBudgetSpent =
    document.querySelector(
        "#dashboard-budget-spent"
    );


const dashboardBudgetRemaining =
    document.querySelector(
        "#dashboard-budget-remaining"
    );


const dashboardBudgetProgress =
    document.querySelector(
        "#dashboard-budget-progress"
    );


const dashboardBudgetStatus =
    document.querySelector(
        "#dashboard-budget-status"
    );


// ==========================================
// FILTER ELEMENTS
// ==========================================

const transactionSearch =
    document.querySelector(
        "#transaction-search"
    );


const filterType =
    document.querySelector(
        "#filter-type"
    );


const filterCategory =
    document.querySelector(
        "#filter-category"
    );


const filterFromDate =
    document.querySelector(
        "#filter-from-date"
    );


const filterToDate =
    document.querySelector(
        "#filter-to-date"
    );


const clearFiltersButton =
    document.querySelector(
        "#clear-filters-btn"
    );


const filterResultCount =
    document.querySelector(
        "#filter-result-count"
    );


// ==========================================
// TRANSACTION DATA
// ==========================================

let allTransactions = [];


// ==========================================
// BUDGET DATA
// ==========================================

let allBudgets = [];


// ==========================================
// CHART VARIABLES
// ==========================================

let incomeExpenseChart = null;

let categoryExpenseChart = null;


// ==========================================
// LOAD TRANSACTIONS
// ==========================================

async function loadTransactions() {

    try {

        const token =
            getToken();


        const response =
            await fetch(
                `${window.API_BASE_URL}/transactions`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to fetch transactions"
            );

        }


        allTransactions =
            data.transactions || [];


        applyFilters();


        // Budget calculation
        updateBudgetOverview();


    } catch (error) {

        console.error(
            "Transaction loading error:",
            error.message
        );


        if (transactionList) {

            transactionList.innerHTML =
                `
                <p>
                    Failed to load transactions.
                    Please try again.
                </p>
                `;

        }

    }

}


// ==========================================
// LOAD BUDGETS
// ==========================================

async function loadDashboardBudgets() {

    try {

        const token =
            getToken();


        const response =
            await fetch(
                `${window.API_BASE_URL}/budgets`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load budgets"
            );

        }


        allBudgets =
            data.budgets || [];


        updateBudgetOverview();


    } catch (error) {

        console.error(
            "Budget loading error:",
            error.message
        );

    }

}


// ==========================================
// UPDATE BUDGET OVERVIEW
// ==========================================

function updateBudgetOverview() {

    if (
        !dashboardBudget ||
        !dashboardBudgetSpent ||
        !dashboardBudgetRemaining
    ) {

        return;

    }


    // ==================================
    // CURRENT MONTH
    // ==================================

    const currentDate =
        new Date();


    const currentMonth =
        currentDate.getMonth() + 1;


    const currentYear =
        currentDate.getFullYear();


    // ==================================
    // FIND MONTHLY BUDGET
    // ==================================

    const monthlyBudget =
        allBudgets.find(
            function (budget) {

                return (
                    budget.type === "monthly" &&
                    Number(budget.month) === currentMonth &&
                    Number(budget.year) === currentYear
                );

            }
        );


    // ==================================
    // NO BUDGET
    // ==================================

    if (!monthlyBudget) {

        dashboardBudget.textContent =
            "₹0";


        dashboardBudgetSpent.textContent =
            "₹0";


        dashboardBudgetRemaining.textContent =
            "₹0";


        if (dashboardBudgetProgress) {

            dashboardBudgetProgress.style.width =
                "0%";

        }


        if (dashboardBudgetStatus) {

            dashboardBudgetStatus.textContent =
                "No budget set for this month.";


            dashboardBudgetStatus.className =
                "budget-status-neutral";

        }


        return;

    }


    // ==================================
    // BUDGET AMOUNT
    // ==================================

    const budgetAmount =
        Number(
            monthlyBudget.amount
        );


    // ==================================
    // CALCULATE CURRENT MONTH EXPENSES
    // ==================================

    let spent =
        0;


    allTransactions.forEach(
        function (transaction) {

            if (
                transaction.type !==
                "expense"
            ) {

                return;

            }


            if (!transaction.date) {

                return;

            }


            const transactionDate =
                new Date(
                    transaction.date
                );


            const transactionMonth =
                transactionDate.getMonth() + 1;


            const transactionYear =
                transactionDate.getFullYear();


            if (
                transactionMonth === currentMonth &&
                transactionYear === currentYear
            ) {

                spent +=
                    Number(
                        transaction.amount
                    );

            }

        }
    );


    // ==================================
    // REMAINING
    // ==================================

    const remaining =
        budgetAmount - spent;


    // ==================================
    // PERCENTAGE
    // ==================================

    let percentage =
        0;


    if (budgetAmount > 0) {

        percentage =
            (spent / budgetAmount) * 100;

    }


    // Maximum 100% visually
    const progressPercentage =
        Math.min(
            Math.max(
                percentage,
                0
            ),
            100
        );


    // ==================================
    // DISPLAY
    // ==================================

    dashboardBudget.textContent =
        `₹${budgetAmount.toFixed(2)}`;


    dashboardBudgetSpent.textContent =
        `₹${spent.toFixed(2)}`;


    dashboardBudgetRemaining.textContent =
        `₹${remaining.toFixed(2)}`;


    // ==================================
    // PROGRESS BAR
    // ==================================

    if (dashboardBudgetProgress) {

        dashboardBudgetProgress.style.width =
            `${progressPercentage}%`;

    }


    // ==================================
    // STATUS
    // ==================================

    if (!dashboardBudgetStatus) {

        return;

    }


    if (spent > budgetAmount) {

        const exceededAmount =
            spent - budgetAmount;


        dashboardBudgetStatus.textContent =
            `⚠️ Budget exceeded by ₹${exceededAmount.toFixed(2)}`;


        dashboardBudgetStatus.className =
            "budget-status-danger";


    } else if (percentage >= 80) {

        dashboardBudgetStatus.textContent =
            `⚠️ You have used ${percentage.toFixed(1)}% of your budget.`;


        dashboardBudgetStatus.className =
            "budget-status-warning";


    } else {

        dashboardBudgetStatus.textContent =
            `✓ You are within budget. ${percentage.toFixed(1)}% used.`;


        dashboardBudgetStatus.className =
            "budget-status-success";

    }

}


// ==========================================
// APPLY FILTERS
// ==========================================

function applyFilters() {

    const searchText =
        transactionSearch
            ? transactionSearch.value
                .trim()
                .toLowerCase()
            : "";


    const selectedType =
        filterType
            ? filterType.value
            : "";


    const selectedCategory =
        filterCategory
            ? filterCategory.value
            : "";


    const fromDate =
        filterFromDate
            ? filterFromDate.value
            : "";


    const toDate =
        filterToDate
            ? filterToDate.value
            : "";


    const filteredTransactions =
        allTransactions.filter(
            function (transaction) {

                const title =
                    String(
                        transaction.title || ""
                    ).toLowerCase();


                const category =
                    String(
                        transaction.category || ""
                    ).toLowerCase();


                const description =
                    String(
                        transaction.description || ""
                    ).toLowerCase();


                const matchesSearch =
                    !searchText ||
                    title.includes(searchText) ||
                    category.includes(searchText) ||
                    description.includes(searchText);


                if (!matchesSearch) {

                    return false;

                }


                if (
                    selectedType &&
                    transaction.type !== selectedType
                ) {

                    return false;

                }


                if (
                    selectedCategory &&
                    transaction.category !== selectedCategory
                ) {

                    return false;

                }


                if (!transaction.date) {

                    return !fromDate &&
                           !toDate;

                }


                const transactionDate =
                    new Date(
                        transaction.date
                    );


                if (fromDate) {

                    const startDate =
                        new Date(
                            `${fromDate}T00:00:00`
                        );


                    if (
                        transactionDate <
                        startDate
                    ) {

                        return false;

                    }

                }


                if (toDate) {

                    const endDate =
                        new Date(
                            `${toDate}T23:59:59`
                        );


                    if (
                        transactionDate >
                        endDate
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    calculateTotals(
        filteredTransactions
    );


    displayTransactions(
        filteredTransactions
    );


    createIncomeExpenseChart(
        filteredTransactions
    );


    createCategoryExpenseChart(
        filteredTransactions
    );


    updateFilterResultCount(
        filteredTransactions
    );

}


// ==========================================
// FILTER RESULT COUNT
// ==========================================

function updateFilterResultCount(
    transactions
) {

    if (!filterResultCount) {

        return;

    }


    if (
        transactions.length ===
        allTransactions.length
    ) {

        filterResultCount.textContent =
            `Showing all ${allTransactions.length} transactions`;

        return;

    }


    filterResultCount.textContent =
        `Showing ${transactions.length} of ${allTransactions.length} transactions`;

}


// ==========================================
// CALCULATE TOTALS
// ==========================================

function calculateTotals(
    transactions
) {

    let income =
        0;


    let expenses =
        0;


    transactions.forEach(
        function (transaction) {

            if (
                transaction.type ===
                "income"
            ) {

                income +=
                    Number(
                        transaction.amount
                    );

            }


            if (
                transaction.type ===
                "expense"
            ) {

                expenses +=
                    Number(
                        transaction.amount
                    );

            }

        }
    );


    const calculatedBalance =
        income - expenses;


    totalIncome.textContent =
        `₹${income.toFixed(2)}`;


    totalExpenses.textContent =
        `₹${expenses.toFixed(2)}`;


    balance.textContent =
        `₹${calculatedBalance.toFixed(2)}`;


    savings.textContent =
        `₹${calculatedBalance.toFixed(2)}`;

}


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions(
    transactions
) {

    transactionList.innerHTML =
        "";


    if (
        transactions.length === 0
    ) {

        transactionList.innerHTML =
            "<p>No matching transactions found.</p>";

        return;

    }


    transactions.forEach(
        function (transaction) {

            const transactionItem =
                document.createElement(
                    "div"
                );


            transactionItem.classList.add(
                "transaction-item"
            );


            transactionItem.innerHTML = `

                <h3>
                    ${transaction.title}
                </h3>

                <p>
                    Type:
                    ${transaction.type}
                </p>

                <p>
                    Amount:
                    ₹${Number(
                        transaction.amount
                    ).toFixed(2)}
                </p>

                <p>
                    Category:
                    ${transaction.category}
                </p>

                <p>
                    Date:
                    ${
                        transaction.date
                            ? new Date(
                                transaction.date
                              ).toLocaleDateString()
                            : "N/A"
                    }
                </p>

                <p>
                    Description:
                    ${
                        transaction.description ||
                        "N/A"
                    }
                </p>


                <div class="transaction-actions">

                    <button
                        type="button"
                        onclick="editTransaction('${transaction._id}')"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        onclick="deleteTransaction('${transaction._id}')"
                    >
                        Delete
                    </button>

                </div>

            `;


            transactionList.appendChild(
                transactionItem
            );

        }
    );

}


// ==========================================
// INCOME VS EXPENSE CHART
// ==========================================

function createIncomeExpenseChart(
    transactions
) {

    const canvas =
        document.querySelector(
            "#income-expense-chart"
        );


    if (!canvas) {

        return;

    }


    let income =
        0;


    let expenses =
        0;


    transactions.forEach(
        function (transaction) {

            if (
                transaction.type ===
                "income"
            ) {

                income +=
                    Number(
                        transaction.amount
                    );

            }


            if (
                transaction.type ===
                "expense"
            ) {

                expenses +=
                    Number(
                        transaction.amount
                    );

            }

        }
    );


    if (incomeExpenseChart) {

        incomeExpenseChart.destroy();

    }


    incomeExpenseChart =
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

                    maintainAspectRatio: true,

                    plugins: {

                        legend: {

                            display: true

                        }

                    },

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
// EXPENSE BY CATEGORY CHART
// ==========================================

function createCategoryExpenseChart(
    transactions
) {

    const canvas =
        document.querySelector(
            "#category-expense-chart"
        );


    if (!canvas) {

        return;

    }


    const categoryTotals =
        {};


    transactions.forEach(
        function (transaction) {

            if (
                transaction.type !==
                "expense"
            ) {

                return;

            }


            const category =
                transaction.category ||
                "Other";


            if (
                !categoryTotals[category]
            ) {

                categoryTotals[category] =
                    0;

            }


            categoryTotals[category] +=
                Number(
                    transaction.amount
                );

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


    if (categoryExpenseChart) {

        categoryExpenseChart.destroy();

    }


    categoryExpenseChart =
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

                    maintainAspectRatio: true,

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
// SEARCH
// ==========================================

if (transactionSearch) {

    transactionSearch.addEventListener(
        "input",
        applyFilters
    );

}


// ==========================================
// TYPE FILTER
// ==========================================

if (filterType) {

    filterType.addEventListener(
        "change",
        applyFilters
    );

}


// ==========================================
// CATEGORY FILTER
// ==========================================

if (filterCategory) {

    filterCategory.addEventListener(
        "change",
        applyFilters
    );

}


// ==========================================
// FROM DATE
// ==========================================

if (filterFromDate) {

    filterFromDate.addEventListener(
        "change",
        applyFilters
    );

}


// ==========================================
// TO DATE
// ==========================================

if (filterToDate) {

    filterToDate.addEventListener(
        "change",
        applyFilters
    );

}


// ==========================================
// CLEAR FILTERS
// ==========================================

if (clearFiltersButton) {

    clearFiltersButton.addEventListener(
        "click",
        function () {

            if (transactionSearch) {

                transactionSearch.value =
                    "";

            }


            if (filterType) {

                filterType.value =
                    "";

            }


            if (filterCategory) {

                filterCategory.value =
                    "";

            }


            if (filterFromDate) {

                filterFromDate.value =
                    "";

            }


            if (filterToDate) {

                filterToDate.value =
                    "";

            }


            applyFilters();

        }
    );

}


// ==========================================
// DELETE TRANSACTION
// ==========================================

async function deleteTransaction(
    transactionId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const token =
            getToken();


        const response =
            await fetch(
                `${window.API_BASE_URL}/transactions/${transactionId}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete transaction"
            );

        }


        alert(
            "Transaction deleted successfully!"
        );


        await loadTransactions();


    } catch (error) {

        console.error(
            "Delete transaction error:",
            error.message
        );


        alert(
            error.message ||
            "Failed to delete transaction"
        );

    }

}


// ==========================================
// EDIT TRANSACTION
// ==========================================

function editTransaction(
    transactionId
) {

    localStorage.setItem(
        "editTransactionId",
        transactionId
    );


    window.location.href =
        "edit-transaction.html";

}


// ==========================================
// LOAD CURRENT USER
// ==========================================

async function loadCurrentUser() {

    try {

        const token =
            getToken();


        const response =
            await fetch(
                `${window.API_BASE_URL}/users/me`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Authentication failed"
            );

        }


        console.log(
            "Current user:",
            data.user
        );


    } catch (error) {

        console.error(
            "Dashboard authentication error:",
            error.message
        );


        logoutUser();


        window.location.href =
            "login.html";

    }

}


// ==========================================
// START DASHBOARD
// ==========================================

loadCurrentUser();

loadDashboardBudgets();

loadTransactions();