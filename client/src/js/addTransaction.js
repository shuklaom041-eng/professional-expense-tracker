// ==========================================
// AUTHENTICATION CHECK
// ==========================================

if (!isAuthenticated()) {

    window.location.href = "login.html";

}


// ==========================================
// DOM ELEMENTS
// ==========================================

const transactionForm =
    document.querySelector("#transaction-form");

const transactionMessage =
    document.querySelector("#transaction-message");

const addTransactionButton =
    document.querySelector("#add-transaction-button");


// ==========================================
// ADD TRANSACTION
// ==========================================

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==================================
            // CLEAR MESSAGE
            // ==================================

            transactionMessage.textContent = "";
            transactionMessage.className = "";


            // ==================================
            // GET FORM VALUES
            // ==================================

            const type =
                document.querySelector(
                    "#transaction-type"
                ).value;

            const title =
                document.querySelector(
                    "#transaction-title"
                ).value.trim();

            const amount =
                document.querySelector(
                    "#transaction-amount"
                ).value;

            const category =
                document.querySelector(
                    "#transaction-category"
                ).value;

            const date =
                document.querySelector(
                    "#transaction-date"
                ).value;

            const description =
                document.querySelector(
                    "#transaction-description"
                ).value.trim();


            // ==================================
            // VALIDATION
            // ==================================

            if (!title) {

                transactionMessage.textContent =
                    "Please enter a transaction title.";

                return;
            }


            if (!amount || Number(amount) <= 0) {

                transactionMessage.textContent =
                    "Please enter a valid amount.";

                return;
            }


            if (!category) {

                transactionMessage.textContent =
                    "Please select a transaction category.";

                return;
            }


            if (
                type !== "income" &&
                type !== "expense"
            ) {

                transactionMessage.textContent =
                    "Invalid transaction type.";

                return;
            }


            // ==================================
            // GET TOKEN
            // ==================================

            const token = getToken();

            if (!token) {

                transactionMessage.textContent =
                    "Your session has expired. Please login again.";

                setTimeout(function () {

                    window.location.href =
                        "login.html";

                }, 1000);

                return;
            }


            // ==================================
            // DISABLE BUTTON
            // ==================================

            addTransactionButton.disabled = true;

            addTransactionButton.textContent =
                "Adding...";


            try {

                // ==================================
                // SEND TO RENDER BACKEND
                // ==================================

                const response = await fetch(
                    `${window.API_BASE_URL}/transactions`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            title: title,

                            amount: Number(amount),

                            type: type,

                            category: category,

                            description: description,

                            date: date || undefined

                        })

                    }
                );


                // ==================================
                // RESPONSE
                // ==================================

                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to add transaction."
                    );
                }


                // ==================================
                // SUCCESS
                // ==================================

                transactionMessage.textContent =
                    "Transaction added successfully!";

                transactionMessage.className =
                    "success";


                console.log(
                    "Transaction created successfully:",
                    data.transaction
                );


                // ==================================
                // RESET FORM
                // ==================================

                transactionForm.reset();


                // ==================================
                // REDIRECT
                // ==================================

                setTimeout(function () {

                    window.location.href =
                        "dashboard.html";

                }, 1000);


            } catch (error) {

                console.error(
                    "Transaction error:",
                    error
                );


                transactionMessage.textContent =
                    error.message ||
                    "Something went wrong while adding the transaction.";

                transactionMessage.className =
                    "error";


                addTransactionButton.disabled =
                    false;

                addTransactionButton.textContent =
                    "Add Transaction";
            }

        }
    );
}