

// ==========================================
// DOM ELEMENTS
// ==========================================

const title =
    document.querySelector("#main-title");

const description =
    document.querySelector("#description");

const heroSection =
    document.querySelector("#hero-section");

const getStartedButton =
    document.querySelector("#get-started-btn");

const loginLink =
    document.querySelector("#login-link");

const transactionForm =
    document.querySelector("#transaction-form");

const transactionList =
    document.querySelector("#transaction-list");


// ==========================================
// TRANSACTION ARRAY
// ==========================================

let transactions = [];


// ==========================================
// HERO SECTION
// ==========================================

description.textContent =
    "Track your income, expenses, and savings in one place.";

heroSection.style.backgroundColor =
    "#e8f0ff";


// ==========================================
// GET STARTED BUTTON
// ==========================================

getStartedButton.addEventListener(
    "click",
    function () {

        title.textContent =
            "Let's Manage Your Money!";

    }
);


// ==========================================
// LOGIN LINK
// ==========================================

loginLink.addEventListener(
    "click",
    function () {

        console.log(
            "Login link clicked!"
        );

    }
);


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions() {

    transactionList.innerHTML = "";


    transactions.forEach(
        function (transaction) {

            const transactionItem =
                document.createElement("div");


            transactionItem.classList.add(
                "transaction-item"
            );


            transactionItem.innerHTML = `

                <h3>
                    ${transaction.title}
                </h3>

                <p>
                    Type: ${transaction.type}
                </p>

                <p>
                    Amount: ₹${transaction.amount}
                </p>

                <p>
                    Category: ${transaction.category}
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

            `;


            transactionList.appendChild(
                transactionItem
            );

        }
    );

}


// ==========================================
// CREATE TRANSACTION
// ==========================================

transactionForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ==================================
        // GET FORM VALUES
        // ==================================

        const type =
            document.querySelector(
                "#transaction-type"
            ).value;


        const titleValue =
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


        const descriptionValue =
            document.querySelector(
                "#transaction-notes"
            ).value.trim();


        // ==================================
        // VALIDATION
        // ==================================

        if (!titleValue) {

            alert(
                "Please enter a transaction title."
            );

            return;

        }


        if (!amount) {

            alert(
                "Please enter a transaction amount."
            );

            return;

        }


        if (!category) {

            alert(
                "Please select a transaction category."
            );

            return;

        }


        // ==================================
        // CHECK LOGIN
        // ==================================

        if (!isAuthenticated()) {

            alert(
                "Please login before adding a transaction."
            );

            window.location.href =
                "login.html";

            return;

        }


        try {

            // Get JWT token
            const token =
                getToken();


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

                            title: titleValue,

                            amount:
                                Number(amount),

                            type: type,

                            category: category,

                            description:
                                descriptionValue,

                            date:
                                date || undefined

                        })

                    }
                );


            // Convert response to JSON
            const data =
                await response.json();


            // ==================================
            // HANDLE ERROR
            // ==================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to create transaction"
                );

            }


            // ==================================
            // SUCCESS
            // ==================================

            console.log(
                "Transaction created:",
                data.transaction
            );


            alert(
                "Transaction added successfully!"
            );


            // Add transaction to local array
            transactions.unshift(
                data.transaction
            );


            // Display transactions
            displayTransactions();


            // Reset form
            transactionForm.reset();


        } catch (error) {

            console.error(
                "Transaction error:",
                error
            );


            alert(
                error.message ||
                "Something went wrong"
            );

        }

    }
);