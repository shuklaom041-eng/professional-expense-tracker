// ==========================================
// BUDGET AUTHENTICATION
// ==========================================

if (!isAuthenticated()) {

    window.location.href = "login.html";

}


// ==========================================
// DOM ELEMENTS
// ==========================================

const budgetForm =
    document.querySelector("#budget-form");

const budgetType =
    document.querySelector("#budget-type");

const budgetCategory =
    document.querySelector("#budget-category");

const categoryGroup =
    document.querySelector("#category-group");

const budgetMonth =
    document.querySelector("#budget-month");

const budgetYear =
    document.querySelector("#budget-year");

const budgetAmount =
    document.querySelector("#budget-amount");

const budgetMessage =
    document.querySelector("#budget-message");

const budgetList =
    document.querySelector("#budget-list");

const noBudgetMessage =
    document.querySelector("#no-budget-message");


// ==========================================
// EDIT ELEMENTS
// ==========================================

const editBudgetSection =
    document.querySelector("#edit-budget-section");

const editBudgetForm =
    document.querySelector("#edit-budget-form");

const editBudgetAmount =
    document.querySelector("#edit-budget-amount");

const cancelBudgetButton =
    document.querySelector("#cancel-budget-button");


// ==========================================
// BUDGET DATA
// ==========================================

let allBudgets = [];

let allTransactions = [];

let editingBudgetId = null;


// ==========================================
// LOAD BUDGETS
// ==========================================

async function loadBudgets() {

    try {

        const token = getToken();

        const response =
            await fetch(
                `${API_BASE_URL}/budgets`,
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
                "Failed to load budgets."
            );

        }


        allBudgets =
            data.budgets || [];


        displayBudgets();


    } catch (error) {

        console.error(
            "Load budgets error:",
            error.message
        );


        showMessage(
            error.message ||
            "Failed to load budgets.",
            true
        );

    }

}


// ==========================================
// LOAD TRANSACTIONS
// ==========================================

async function loadBudgetTransactions() {

    try {

        const token = getToken();

        const response =
            await fetch(
                `${API_BASE_URL}/transactions`,
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
                "Failed to load transactions."
            );

        }


        allTransactions =
            data.transactions || [];


        // Re-display budgets after
        // transaction data is available

        displayBudgets();


    } catch (error) {

        console.error(
            "Load budget transactions error:",
            error.message
        );

    }

}


// ==========================================
// DISPLAY BUDGETS
// ==========================================

function displayBudgets() {

    if (!budgetList) {

        return;

    }


    budgetList.innerHTML = "";


    // ==================================
    // NO BUDGETS
    // ==================================

    if (allBudgets.length === 0) {

        if (noBudgetMessage) {

            noBudgetMessage.style.display =
                "block";

        }

        return;

    }


    if (noBudgetMessage) {

        noBudgetMessage.style.display =
            "none";

    }


    // ==================================
    // DISPLAY EACH BUDGET
    // ==================================

    allBudgets.forEach(
        function (budget) {

            const budgetCard =
                document.createElement("div");


            budgetCard.classList.add(
                "budget-card"
            );


            // ==================================
            // BUDGET TYPE
            // ==================================

            const budgetTypeText =
                budget.type === "monthly"
                    ? "Monthly Budget"
                    : "Category Budget";


            // ==================================
            // CATEGORY
            // ==================================

            const categoryText =
                budget.category ||
                "All Categories";


            // ==================================
            // MONTH
            // ==================================

            const monthName =
                getMonthName(
                    budget.month
                );


            // ==================================
            // BUDGET AMOUNT
            // ==================================

            const budgetAmountValue =
                Number(
                    budget.amount
                ) || 0;


            // ==================================
            // CALCULATE SPENDING
            // ==================================

            const spent =
                calculateBudgetSpent(
                    budget
                );


            const remaining =
                budgetAmountValue -
                spent;


            // ==================================
            // USAGE PERCENTAGE
            // ==================================

            let usagePercentage = 0;


            if (budgetAmountValue > 0) {

                usagePercentage =
                    (spent /
                    budgetAmountValue) *
                    100;

            }


            // Prevent negative progress width

            const progressWidth =
                Math.min(
                    Math.max(
                        usagePercentage,
                        0
                    ),
                    100
                );


            // ==================================
            // STATUS
            // ==================================

            let statusText =
                "Within Budget";

            let statusClass =
                "budget-status-good";


            if (spent > budgetAmountValue) {

                statusText =
                    "Over Budget";

                statusClass =
                    "budget-status-danger";

            } else if (
                usagePercentage >= 80
            ) {

                statusText =
                    "Budget Almost Used";

                statusClass =
                    "budget-status-warning";

            }


            // ==================================
            // REMAINING TEXT
            // ==================================

            let remainingLabel =
                "Remaining";

            let remainingValue =
                remaining;


            if (remaining < 0) {

                remainingLabel =
                    "Over Budget";

                remainingValue =
                    Math.abs(remaining);

            }


            // ==================================
            // CREATE CARD
            // ==================================

            budgetCard.innerHTML = `

                <div class="budget-card-header">

                    <h3>
                        ${budgetTypeText}
                    </h3>

                    <span class="budget-type">
                        ${budget.type}
                    </span>

                </div>


                <div class="budget-details">


                    <div class="budget-detail">

                        <span class="budget-detail-label">
                            Category
                        </span>

                        <span class="budget-detail-value">
                            ${categoryText}
                        </span>

                    </div>


                    <div class="budget-detail">

                        <span class="budget-detail-label">
                            Period
                        </span>

                        <span class="budget-detail-value">
                            ${monthName}
                            ${budget.year}
                        </span>

                    </div>


                    <div class="budget-detail">

                        <span class="budget-detail-label">
                            Budget Amount
                        </span>

                        <span class="budget-detail-value">
                            ₹${budgetAmountValue.toFixed(2)}
                        </span>

                    </div>


                    <div class="budget-detail">

                        <span class="budget-detail-label">
                            Spent
                        </span>

                        <span class="budget-detail-value">
                            ₹${spent.toFixed(2)}
                        </span>

                    </div>


                    <div class="budget-detail">

                        <span class="budget-detail-label">
                            ${remainingLabel}
                        </span>

                        <span class="budget-detail-value">
                            ₹${remainingValue.toFixed(2)}
                        </span>

                    </div>


                </div>


                <!-- ================================= -->
                <!-- BUDGET TRACKING -->
                <!-- ================================= -->

                <div class="budget-tracking">

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            margin-bottom:8px;
                        "
                    >

                        <strong>
                            Budget Usage
                        </strong>

                        <span>
                            ${usagePercentage.toFixed(1)}%
                        </span>

                    </div>


                    <div
                        style="
                            width:100%;
                            height:12px;
                            background:#e5e7eb;
                            border-radius:999px;
                            overflow:hidden;
                        "
                    >

                        <div
                            style="
                                width:${progressWidth}%;
                                height:100%;
                                background:${getProgressColor(
                                    usagePercentage
                                )};
                                border-radius:999px;
                                transition:width 0.4s ease;
                            "
                        ></div>

                    </div>


                    <p
                        class="${statusClass}"
                        style="
                            margin-top:8px;
                            font-weight:600;
                        "
                    >
                        ${statusText}
                    </p>

                </div>


                <!-- ================================= -->
                <!-- ACTION BUTTONS -->
                <!-- ================================= -->

                <div class="budget-actions">

                    <button
                        type="button"
                        class="edit-budget-button"
                        onclick="startEditBudget('${budget._id}')"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="delete-budget-button"
                        onclick="deleteBudget('${budget._id}')"
                    >
                        Delete
                    </button>

                </div>

            `;


            budgetList.appendChild(
                budgetCard
            );

        }
    );

}


// ==========================================
// CALCULATE BUDGET SPENT
// ==========================================

function calculateBudgetSpent(
    budget
) {

    let totalSpent = 0;


    allTransactions.forEach(
        function (transaction) {

            // Only expenses count
            // towards a budget

            if (
                transaction.type !==
                "expense"
            ) {

                return;

            }


            // Transactions without
            // dates cannot be matched

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


            // ==================================
            // MONTH/YEAR MATCH
            // ==================================

            if (
                transactionMonth !==
                Number(budget.month)
            ) {

                return;

            }


            if (
                transactionYear !==
                Number(budget.year)
            ) {

                return;

            }


            // ==================================
            // CATEGORY MATCH
            // ==================================

            if (
                budget.type ===
                "category"
            ) {

                const transactionCategory =
                    String(
                        transaction.category ||
                        ""
                    ).trim().toLowerCase();


                const budgetCategoryName =
                    String(
                        budget.category ||
                        ""
                    ).trim().toLowerCase();


                if (
                    transactionCategory !==
                    budgetCategoryName
                ) {

                    return;

                }

            }


            // ==================================
            // ADD EXPENSE
            // ==================================

            totalSpent +=
                Number(
                    transaction.amount
                ) || 0;

        }
    );


    return totalSpent;

}


// ==========================================
// PROGRESS COLOR
// ==========================================

function getProgressColor(
    percentage
) {

    if (percentage > 100) {

        return "#dc2626";

    }


    if (percentage >= 80) {

        return "#f59e0b";

    }


    return "#16a34a";

}


// ==========================================
// GET MONTH NAME
// ==========================================

function getMonthName(
    month
) {

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


    const monthNumber =
        Number(month);


    return (
        months[monthNumber - 1] ||
        "Unknown"
    );

}


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(
    message,
    isError = false
) {

    if (!budgetMessage) {

        return;

    }


    budgetMessage.textContent =
        message;


    budgetMessage.style.color =
        isError
            ? "#dc2626"
            : "#16a34a";

}


// ==========================================
// CREATE BUDGET
// ==========================================

async function createBudget(
    event
) {

    event.preventDefault();


    const type =
        budgetType.value;


    const category =
        budgetCategory.value;


    const month =
        Number(
            budgetMonth.value
        );


    const year =
        Number(
            budgetYear.value
        );


    const amount =
        Number(
            budgetAmount.value
        );


    // ==================================
    // VALIDATION
    // ==================================

    if (!type) {

        showMessage(
            "Please select a budget type.",
            true
        );

        return;

    }


    if (
        type === "category" &&
        !category
    ) {

        showMessage(
            "Please select a category.",
            true
        );

        return;

    }


    if (!month) {

        showMessage(
            "Please select a month.",
            true
        );

        return;

    }


    if (!year) {

        showMessage(
            "Please enter a year.",
            true
        );

        return;

    }


    if (
        !amount ||
        amount <= 0
    ) {

        showMessage(
            "Budget amount must be greater than 0.",
            true
        );

        return;

    }


    try {

        const token =
            getToken();


        const response =
            await fetch(
                `${API_BASE_URL}/budgets`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        type,

                        category:
                            type === "category"
                                ? category
                                : null,

                        month,

                        year,

                        amount

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to create budget."
            );

        }


        showMessage(
            "Budget created successfully."
        );


        budgetForm.reset();


        updateCategoryVisibility();


        await loadBudgets();


        await loadBudgetTransactions();


    } catch (error) {

        console.error(
            "Create budget error:",
            error.message
        );


        showMessage(
            error.message ||
            "Failed to create budget.",
            true
        );

    }

}


// ==========================================
// CATEGORY VISIBILITY
// ==========================================

function updateCategoryVisibility() {

    if (
        budgetType.value ===
        "category"
    ) {

        categoryGroup.style.display =
            "flex";

        budgetCategory.required =
            true;

    } else {

        categoryGroup.style.display =
            "flex";

        budgetCategory.required =
            false;

    }

}


// ==========================================
// START EDIT BUDGET
// ==========================================

function startEditBudget(
    budgetId
) {

    const budget =
        allBudgets.find(
            function (item) {

                return item._id ===
                    budgetId;

            }
        );


    if (!budget) {

        alert(
            "Budget not found."
        );

        return;

    }


    editingBudgetId =
        budgetId;


    editBudgetAmount.value =
        budget.amount;


    editBudgetSection.style.display =
        "block";


    editBudgetSection.scrollIntoView({

        behavior: "smooth"

    });

}


// ==========================================
// UPDATE BUDGET
// ==========================================

async function updateBudget(
    event
) {

    event.preventDefault();


    if (!editingBudgetId) {

        return;

    }


    const amount =
        Number(
            editBudgetAmount.value
        );


    if (
        !amount ||
        amount <= 0
    ) {

        alert(
            "Budget amount must be greater than 0."
        );

        return;

    }


    try {

        const token =
            getToken();


        const response =
            await fetch(
                `${API_BASE_URL}/budgets/${editingBudgetId}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        amount

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update budget."
            );

        }


        alert(
            "Budget updated successfully."
        );


        cancelEditBudget();


        await loadBudgets();


        await loadBudgetTransactions();


    } catch (error) {

        console.error(
            "Update budget error:",
            error.message
        );


        alert(
            error.message ||
            "Failed to update budget."
        );

    }

}


// ==========================================
// CANCEL EDIT
// ==========================================

function cancelEditBudget() {

    editingBudgetId =
        null;


    if (editBudgetAmount) {

        editBudgetAmount.value =
            "";

    }


    if (editBudgetSection) {

        editBudgetSection.style.display =
            "none";

    }

}


// ==========================================
// DELETE BUDGET
// ==========================================

async function deleteBudget(
    budgetId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this budget?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const token =
            getToken();


        const response =
            await fetch(
                `${API_BASE_URL}/budgets/${budgetId}`,
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
                "Failed to delete budget."
            );

        }


        alert(
            "Budget deleted successfully."
        );


        await loadBudgets();


        await loadBudgetTransactions();


    } catch (error) {

        console.error(
            "Delete budget error:",
            error.message
        );


        alert(
            error.message ||
            "Failed to delete budget."
        );

    }

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
                `${API_BASE_URL}/users/me`,
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
                "Authentication failed."
            );

        }


        console.log(
            "Current user:",
            data.user
        );


    } catch (error) {

        console.error(
            "Budget authentication error:",
            error.message
        );


        logoutUser();


        window.location.href =
            "login.html";

    }

}


// ==========================================
// EVENT LISTENERS
// ==========================================

// CREATE BUDGET

if (budgetForm) {

    budgetForm.addEventListener(
        "submit",
        createBudget
    );

}


// BUDGET TYPE CHANGE

if (budgetType) {

    budgetType.addEventListener(
        "change",
        updateCategoryVisibility
    );

}


// EDIT FORM

if (editBudgetForm) {

    editBudgetForm.addEventListener(
        "submit",
        updateBudget
    );

}


// CANCEL EDIT

if (cancelBudgetButton) {

    cancelBudgetButton.addEventListener(
        "click",
        cancelEditBudget
    );

}


// ==========================================
// INITIAL CATEGORY STATE
// ==========================================

updateCategoryVisibility();


// ==========================================
// START BUDGET PAGE
// ==========================================

loadCurrentUser();

loadBudgets();

loadBudgetTransactions();