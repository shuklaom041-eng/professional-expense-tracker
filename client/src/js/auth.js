

// ==========================================
// API CONFIGURATION
// ==========================================

// Production Backend - Render
window.API_BASE_URL =
    window.API_BASE_URL ||
    "https://professional-expense-tracker1.onrender.com/api";


// ==========================================
// LOGIN USER
// ==========================================

async function loginUser(
    email,
    password
) {

    try {

        const response =
            await fetch(
                `${window.API_BASE_URL}/auth/login`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        email: email,

                        password: password

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Login failed"
            );

        }


        // ==================================
        // STORE JWT TOKEN
        // ==================================

        localStorage.setItem(
            "token",
            data.token
        );


        // ==================================
        // STORE USER INFORMATION
        // ==================================

        localStorage.setItem(
            "user",
            JSON.stringify(
                data.user
            )
        );


        console.log(
            "Login successful"
        );


        return data;


    } catch (error) {

        console.error(
            "Login error:",
            error.message
        );


        throw error;

    }

}


// ==========================================
// GET JWT TOKEN
// ==========================================

function getToken() {

    return localStorage.getItem(
        "token"
    );

}


// ==========================================
// GET CURRENT USER FROM STORAGE
// ==========================================

function getStoredUser() {

    const user =
        localStorage.getItem(
            "user"
        );


    if (!user) {

        return null;

    }


    try {

        return JSON.parse(
            user
        );

    } catch (error) {

        console.error(
            "Stored user data error:",
            error.message
        );

        return null;

    }

}


// ==========================================
// CHECK AUTHENTICATION
// ==========================================

function isAuthenticated() {

    const token =
        getToken();


    return (
        token !== null &&
        token !== ""
    );

}


// ==========================================
// LOGOUT USER
// ==========================================

function logoutUser() {

    // ==================================
    // REMOVE JWT TOKEN
    // ==================================

    localStorage.removeItem(
        "token"
    );


    // ==================================
    // REMOVE STORED USER
    // ==================================

    localStorage.removeItem(
        "user"
    );


    console.log(
        "User logged out"
    );


    // ==================================
    // REDIRECT TO LOGIN
    // ==================================

    window.location.href =
        "login.html";

}

