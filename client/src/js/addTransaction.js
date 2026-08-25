
// ==========================================
// AUTHENTICATION CHECK
// ==========================================

if (!isAuthenticated()) {

    window.location.href =
        "login.html";

}


// ==========================================
// DOM ELEMENTS
// ==========================================

const transactionForm =
    document.querySelector(
        "#transaction-form"
    );


const transactionMessage =
    document.querySelector(
        "#transaction-message"
    );


const addTransactionButton =
    document.querySelector(
        "#add-transaction-button"
    );


// ==========================================
// CHECK REQUIRED ELEMENTS
// ==========================================

if (
    !transactionForm ||
    !transactionMessage ||
    !addTransactionButton
) {

    console.error(
        "Transaction form elements not found."
    );

}


// ==========================================
// ADD TRANSACTION
// ==========================================

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        async function (event) {

            // Prevent page reload

            event.preventDefault();


            // ==================================
            // CLEAR PREVIOUS MESSAGE
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
            // CHECK TOKEN
            // ==================================

            const token =
                getToken();


            if (!token) {

                transactionMessage.textContent =
                    "Your session has expired. Please login again.";

                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1000
                );

                return;

            }


            // ==================================
            // DISABLE BUTTON
            // ==================================

            addTransactionButton.disabled =
                true;


            addTransactionButton.textContent =
                "Adding...";


            try {

                // ==================================
                // SEND TRANSACTION TO BACKEND
                // ==================================

                const response =
                    await fetch(
                        `${API_BASE_URL}/transactions`,
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


                // ==================================
                // READ RESPONSE
                // ==================================

                const data =
                    await response.json();


                // ==================================
                // HANDLE BACKEND ERROR
                // ==================================

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
                // REDIRECT TO DASHBOARD
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
                    "Transaction error:",
                    error
                );


                transactionMessage.textContent =
                    error.message ||
                    "Something went wrong while adding the transaction.";


                transactionMessage.className =
                    "error";


                // ==================================
                // ENABLE BUTTON AGAIN
                // ==================================

                addTransactionButton.disabled =
                    false;


                addTransactionButton.textContent =
                    "Add Transaction";

            }

        }
    );

}

