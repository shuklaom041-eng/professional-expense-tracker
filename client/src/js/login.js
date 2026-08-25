// ==========================================
// LOGIN PAGE
// ==========================================


// Get login form
const loginForm =
    document.querySelector("#login-form");


// Get message element
const loginMessage =
    document.querySelector("#login-message");


// Get login button
const loginButton =
    document.querySelector("#login-button");


// ==========================================
// LOGIN FORM SUBMISSION
// ==========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        // Prevent page refresh
        event.preventDefault();


        // Get form values
        const email =
            document.querySelector("#email").value.trim();

        const password =
            document.querySelector("#password").value;


        // Clear previous message
        loginMessage.textContent = "";


        // Disable button
        loginButton.disabled = true;

        loginButton.textContent =
            "Logging in...";


        try {

            // Call authentication function
            await loginUser(
                email,
                password
            );


            // Success message
            loginMessage.textContent =
                "Login successful!";


            loginMessage.className =
                "login-message success";


            // Redirect to dashboard
            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 1000);


        } catch (error) {

            // Show error
            loginMessage.textContent =
                error.message;


            loginMessage.className =
                "login-message error";


            // Enable button again
            loginButton.disabled = false;

            loginButton.textContent =
                "Login";

        }

    }
);