
// ==========================================
// USER CONTROLLER
// ==========================================

const bcrypt =
    require("bcryptjs");


// ==========================================
// GET CURRENT LOGGED-IN USER
// ==========================================

const getCurrentUser = function (
    req,
    res
) {

    res.status(200).json({

        success: true,

        message:
            "Current user retrieved successfully",

        user: {

            id:
                req.user._id,

            name:
                req.user.name,

            email:
                req.user.email

        }

    });

};


// ==========================================
// UPDATE CURRENT USER
// ==========================================

const updateCurrentUser = async function (
    req,
    res
) {

    try {

        // ==================================
        // GET DATA FROM REQUEST
        // ==================================

        const {
            name,
            email
        } = req.body;


        // ==================================
        // VALIDATION
        // ==================================

        if (
            !name ||
            !name.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name is required"

            });

        }


        if (
            !email ||
            !email.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email is required"

            });

        }


        // ==================================
        // UPDATE USER
        // ==================================

        req.user.name =
            name.trim();


        req.user.email =
            email.trim();


        await req.user.save();


        // ==================================
        // SEND UPDATED USER
        // ==================================

        res.status(200).json({

            success: true,

            message:
                "Profile updated successfully",

            user: {

                id:
                    req.user._id,

                name:
                    req.user.name,

                email:
                    req.user.email

            }

        });


    } catch (error) {

        console.error(
            "Update profile error:",
            error.message
        );


        // ==================================
        // DUPLICATE EMAIL
        // ==================================

        if (
            error.code === 11000
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email is already registered"

            });

        }


        // ==================================
        // GENERAL ERROR
        // ==================================

        res.status(500).json({

            success: false,

            message:
                "Failed to update profile"

        });

    }

};


// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async function (
    req,
    res
) {

    try {

        // ==================================
        // GET PASSWORDS
        // ==================================

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;


        // ==================================
        // VALIDATION
        // ==================================

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All password fields are required"

            });

        }


        // ==================================
        // CHECK NEW PASSWORD
        // ==================================

        if (
            newPassword.length < 6
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be at least 6 characters long"

            });

        }


        // ==================================
        // CONFIRM NEW PASSWORD
        // ==================================

        if (
            newPassword !==
            confirmPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New passwords do not match"

            });

        }


        // ==================================
        // GET USER WITH PASSWORD
        // ==================================

        const User =
            require("../models/User");


        const user =
            await User.findById(
                req.user._id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        // ==================================
        // VERIFY CURRENT PASSWORD
        // ==================================

        const passwordMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Current password is incorrect"

            });

        }


        // ==================================
        // HASH NEW PASSWORD
        // ==================================

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        // ==================================
        // SAVE NEW PASSWORD
        // ==================================

        user.password =
            hashedPassword;


        await user.save();


        // ==================================
        // SUCCESS RESPONSE
        // ==================================

        res.status(200).json({

            success: true,

            message:
                "Password changed successfully"

        });


    } catch (error) {

        console.error(
            "Change password error:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to change password"

        });

    }

};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {

    getCurrentUser,

    updateCurrentUser,

    changePassword

};

