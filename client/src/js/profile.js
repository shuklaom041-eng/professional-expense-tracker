
// ==========================================
// PROFILE AUTHENTICATION
// ==========================================

if (!isAuthenticated()) {

    window.location.href =
        "login.html";

}


// ==========================================
// DOM ELEMENTS
// ==========================================

const profileName =
    document.querySelector(
        "#profile-name"
    );


const profileEmail =
    document.querySelector(
        "#profile-email"
    );


const profileUserId =
    document.querySelector(
        "#profile-user-id"
    );


const editProfileButton =
    document.querySelector(
        "#edit-profile-button"
    );


const editProfileSection =
    document.querySelector(
        "#edit-profile-section"
    );


const editProfileForm =
    document.querySelector(
        "#edit-profile-form"
    );


const editProfileName =
    document.querySelector(
        "#edit-profile-name"
    );


const editProfileEmail =
    document.querySelector(
        "#edit-profile-email"
    );


const cancelProfileButton =
    document.querySelector(
        "#cancel-profile-button"
    );


const saveProfileButton =
    document.querySelector(
        "#save-profile-button"
    );


const profileMessage =
    document.querySelector(
        "#profile-message"
    );


const logoutLink =
    document.querySelector(
        "#logout-link"
    );


// ==========================================
// CHANGE PASSWORD ELEMENTS
// ==========================================

const changePasswordForm =
    document.querySelector(
        "#change-password-form"
    );


const currentPassword =
    document.querySelector(
        "#current-password"
    );


const newPassword =
    document.querySelector(
        "#new-password"
    );


const confirmPassword =
    document.querySelector(
        "#confirm-password"
    );


const changePasswordButton =
    document.querySelector(
        "#change-password-button"
    );


const passwordMessage =
    document.querySelector(
        "#password-message"
    );


// ==========================================
// LOAD CURRENT USER
// ==========================================

async function loadProfile() {

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
                "Failed to load profile"
            );

        }


        const user =
            data.user;


        profileName.textContent =
            user.name;


        profileEmail.textContent =
            user.email;


        profileUserId.textContent =
            user.id;


        editProfileName.value =
            user.name;


        editProfileEmail.value =
            user.email;


        console.log(
            "Profile loaded:",
            user
        );


    } catch (error) {

        console.error(
            "Profile loading error:",
            error.message
        );


        profileMessage.textContent =
            error.message;


        profileMessage.style.color =
            "#dc2626";

    }

}


// ==========================================
// OPEN EDIT PROFILE
// ==========================================

editProfileButton.addEventListener(
    "click",
    function () {

        editProfileSection.style.display =
            "block";


        editProfileButton.style.display =
            "none";


        profileMessage.textContent =
            "";

    }
);


// ==========================================
// CANCEL EDIT PROFILE
// ==========================================

cancelProfileButton.addEventListener(
    "click",
    function () {

        editProfileSection.style.display =
            "none";


        editProfileButton.style.display =
            "inline-block";


        profileMessage.textContent =
            "";

    }
);


// ==========================================
// UPDATE PROFILE
// ==========================================

editProfileForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            editProfileName.value.trim();


        const email =
            editProfileEmail.value.trim();


        if (!name) {

            profileMessage.textContent =
                "Please enter your name.";

            profileMessage.style.color =
                "#dc2626";

            return;

        }


        if (!email) {

            profileMessage.textContent =
                "Please enter your email.";

            profileMessage.style.color =
                "#dc2626";

            return;

        }


        saveProfileButton.disabled =
            true;


        saveProfileButton.textContent =
            "Saving...";


        profileMessage.textContent =
            "";


        try {

            const token =
                getToken();


            const response =
                await fetch(
                    `${API_BASE_URL}/users/me`,
                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            name:
                                name,

                            email:
                                email

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update profile"
                );

            }


            profileName.textContent =
                data.user.name;


            profileEmail.textContent =
                data.user.email;


            editProfileName.value =
                data.user.name;


            editProfileEmail.value =
                data.user.email;


            profileMessage.textContent =
                "Profile updated successfully!";


            profileMessage.style.color =
                "#16a34a";


            setTimeout(
                function () {

                    editProfileSection.style.display =
                        "none";


                    editProfileButton.style.display =
                        "inline-block";


                    profileMessage.textContent =
                        "";

                },
                1200
            );


        } catch (error) {

            console.error(
                "Profile update error:",
                error.message
            );


            profileMessage.textContent =
                error.message;


            profileMessage.style.color =
                "#dc2626";


        } finally {

            saveProfileButton.disabled =
                false;


            saveProfileButton.textContent =
                "Save Changes";

        }

    }
);


// ==========================================
// CHANGE PASSWORD
// ==========================================

changePasswordForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ==================================
        // GET PASSWORD VALUES
        // ==================================

        const currentPasswordValue =
            currentPassword.value;


        const newPasswordValue =
            newPassword.value;


        const confirmPasswordValue =
            confirmPassword.value;


        passwordMessage.textContent =
            "";


        // ==================================
        // VALIDATION
        // ==================================

        if (
            !currentPasswordValue ||
            !newPasswordValue ||
            !confirmPasswordValue
        ) {

            passwordMessage.textContent =
                "Please fill all password fields.";

            passwordMessage.style.color =
                "#dc2626";

            return;

        }


        if (
            newPasswordValue.length < 6
        ) {

            passwordMessage.textContent =
                "New password must be at least 6 characters.";

            passwordMessage.style.color =
                "#dc2626";

            return;

        }


        if (
            newPasswordValue !==
            confirmPasswordValue
        ) {

            passwordMessage.textContent =
                "New passwords do not match.";

            passwordMessage.style.color =
                "#dc2626";

            return;

        }


        // ==================================
        // DISABLE BUTTON
        // ==================================

        changePasswordButton.disabled =
            true;


        changePasswordButton.textContent =
            "Changing...";


        try {

            // ==================================
            // GET TOKEN
            // ==================================

            const token =
                getToken();


            // ==================================
            // SEND REQUEST
            // ==================================

            const response =
                await fetch(
                    `${API_BASE_URL}/users/change-password`,
                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            currentPassword:
                                currentPasswordValue,

                            newPassword:
                                newPasswordValue,

                            confirmPassword:
                                confirmPasswordValue

                        })

                    }
                );


            // ==================================
            // RESPONSE
            // ==================================

            const data =
                await response.json();


            // ==================================
            // HANDLE ERROR
            // ==================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to change password"
                );

            }


            // ==================================
            // SUCCESS
            // ==================================

            passwordMessage.textContent =
                "Password changed successfully!";


            passwordMessage.style.color =
                "#16a34a";


            // Clear password fields

            changePasswordForm.reset();


            console.log(
                "Password changed successfully"
            );


        } catch (error) {

            console.error(
                "Change password error:",
                error.message
            );


            passwordMessage.textContent =
                error.message;


            passwordMessage.style.color =
                "#dc2626";


        } finally {

            changePasswordButton.disabled =
                false;


            changePasswordButton.textContent =
                "Change Password";

        }

    }
);


// ==========================================
// LOGOUT
// ==========================================

logoutLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();


        logoutUser();


        window.location.href =
            "login.html";

    }
);


// ==========================================
// START PROFILE
// ==========================================

loadProfile();

