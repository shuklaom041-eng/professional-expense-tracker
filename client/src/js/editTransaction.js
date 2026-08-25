
// ==========================================
// AUTHENTICATION CHECK
// ==========================================

if (!isAuthenticated()) {

    window.location.href =
        "login.html";

}


// ==========================================
// GET TRANSACTION ID
// ==========================================

const transactionId =
    localStorage.getItem(
        "editTransactionId"
    );


if (!transactionId) {

    alert(
        "No transaction selected for editing."
    );

    window.location.href =
        "dashboard.html";

}


// ==========================================
// DOM ELEMENTS
// ==========================================

const editTransactionForm =
    document.querySelector(
        "#edit-transaction-form"
    );


const transactionMessage =
    document.querySelector(
        "#transaction-message"
    );


const updateButton =
    document.querySelector(
        "#update-transaction-button"
    );


// ==========================================
// FORM INPUTS
// ==========================================

const typeInput =
    document.querySelector(
        "#transaction-type"
    );


const titleInput =
    document.querySelector(
        "#transaction-title"
    );


const amountInput =
    document.querySelector(
        "#transaction-amount"
    );


const categoryInput =
    document.querySelector(
        "#transaction-category"
    );


const dateInput =
    document.querySelector(
        "#transaction-date"
    );


const descriptionInput =
    document.querySelector(
        "#transaction-description"
    );


// ==========================================
// LOAD TRANSACTION
// ==========================================

async function loadTransaction() {

    try {

        const token =
            getToken();


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


        // ==================================
        // FIND SELECTED TRANSACTION
        // ==================================

        const transaction =
            data.transactions.find(
                function (item) {

                    return (
                        item._id ===
                        transactionId
                    );

                }
            );


        if (!transaction) {

            throw new Error(
                "Transaction not found."
            );

        }


        // ==================================
        // FILL FORM
        // ==================================

        typeInput.value =
            transaction.type;


        titleInput.value =
            transaction.title;


        amountInput.value =
            transaction.amount;


        categoryInput.value =
            transaction.category;


        if (transaction.date) {

            dateInput.value =
                new Date(
                    transaction.date
                )
                .toISOString()
                .split("T")[0];

        }


        descriptionInput.value =
            transaction.description ||
            "";


    } catch (error) {

        console.error(
            "Load transaction error:",
            error.message
        );


        transactionMessage.textContent =
            error.message;

    }

}


// ==========================================
// UPDATE TRANSACTION
// ==========================================

editTransactionForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ==================================
        // GET VALUES
        // ==================================

        const type =
            typeInput.value;


        const title =
            titleInput.value.trim();


        const amount =
            amountInput.value;


        const category =
            categoryInput.value;


        const date =
            dateInput.value;


        const description =
            descriptionInput.value.trim();


        // ==================================
        // VALIDATION
        // ==================================

        if (!title) {

            transactionMessage.textContent =
                "Please enter a transaction title.";

            return;

        }


        if (
            !amount ||
            Number(amount) <= 0
        ) {

            transactionMessage.textContent =
                "Please enter a valid amount.";

            return;

        }


        if (!category) {

            transactionMessage.textContent =
                "Please select a category.";

            return;

        }


        // ==================================
        // DISABLE BUTTON
        // ==================================

        updateButton.disabled =
            true;


        updateButton.textContent =
            "Updating...";


        transactionMessage.textContent =
            "";


        try {

            // ==================================
            // GET TOKEN
            // ==================================

            const token =
                getToken();


            // ==================================
            // SEND UPDATE REQUEST
            // ==================================

            const response =
                await fetch(
                    `${API_BASE_URL}/transactions/${transactionId}`,
                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            title: title,

                            amount:
                                Number(amount),

                            type: type,

                            category: category,

                            description:
                                description,

                            date:
                                date || undefined

                        })

                    }
                );


            const data =
                await response.json();


            // ==================================
            // HANDLE ERROR
            // ==================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update transaction."
                );

            }


            // ==================================
            // SUCCESS
            // ==================================

            transactionMessage.textContent =
                "Transaction updated successfully!";


            console.log(
                "Updated transaction:",
                data.transaction
            );


            // ==================================
            // REMOVE STORED ID
            // ==================================

            localStorage.removeItem(
                "editTransactionId"
            );


            // ==================================
            // REDIRECT
            // ==================================

            setTimeout(
                function () {

                    window.location.href =
                        "dashboard.html";

                },
                1000
            );


        } catch (error) {

            console.error(
                "Update transaction error:",
                error.message
            );


            transactionMessage.textContent =
                error.message;


            // Enable button

            updateButton.disabled =
                false;


            updateButton.textContent =
                "Update Transaction";

        }

    }
);


// ==========================================
// START
// ==========================================

loadTransaction();

