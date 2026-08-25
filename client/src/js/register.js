// ==========================================
// REGISTER PAGE
// ==========================================


// Get register form
const registerForm =
    document.querySelector("#register-form");


// Get message element
const registerMessage =
    document.querySelector("#register-message");


// Get register button
const registerButton =
    document.querySelector("#register-button");


// ==========================================
// REGISTER FORM SUBMISSION
// ==========================================

registerForm.addEventListener(
    "submit",
    async function (event) {

        // Prevent page refresh
        event.preventDefault();


        // Get form values
        const name =
            document.querySelector("#name").value.trim();

        const email =
            document.querySelector("#email").value.trim();

        const password =
            document.querySelector("#password").value;

        const confirmPassword =
            document.querySelector("#confirm-password").value;


        // Clear previous message
        registerMessage.textContent = "";


        // ==========================================
        // PASSWORD VALIDATION
        // ==========================================

        if (password !== confirmPassword) {

            registerMessage.textContent =
                "Passwords do not match.";

            registerMessage.className =
                "login-message error";

            return;

        }


        // Disable button
        registerButton.disabled = true;

        registerButton.textContent =
            "Creating Account...";


        try {

            // Send registration request
            const response = await fetch(
                `${API_BASE_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            // Convert response to JSON
            const data =
                await response.json();


            // Check response
            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Registration failed"
                );

            }


            // Success message
            registerMessage.textContent =
                "Account created successfully!";

            registerMessage.className =
                "login-message success";


            // Redirect to login page
            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 1000);


        } catch (error) {

            console.error(
                "Registration error:",
                error.message
            );


            // Show error
            registerMessage.textContent =
                error.message;

            registerMessage.className =
                "login-message error";


            // Enable button again
            registerButton.disabled = false;

            registerButton.textContent =
                "Create Account";

        }

    }
);