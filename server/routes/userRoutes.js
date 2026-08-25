
const express = require("express");

const router =
    express.Router();


const userController =
    require("../controllers/userController");


const protect =
    require("../middleware/auth");


// ==========================================
// USER CONTROLLER TEST ROUTE
// ==========================================

router.get(
    "/",
    function (req, res) {

        res.send(
            "User Controller Working"
        );

    }
);


// ==========================================
// PROTECTED TEST ROUTE
// ==========================================

router.get(
    "/protected",
    protect,
    function (req, res) {

        res.status(200).json({

            success: true,

            message:
                "Protected route accessed successfully",

            user: {

                id:
                    req.user._id,

                name:
                    req.user.name,

                email:
                    req.user.email

            }

        });

    }
);


// ==========================================
// GET CURRENT USER
// ==========================================

router.get(
    "/me",
    protect,
    userController.getCurrentUser
);


// ==========================================
// UPDATE CURRENT USER
// ==========================================

router.put(
    "/me",
    protect,
    userController.updateCurrentUser
);


// ==========================================
// CHANGE PASSWORD
// ==========================================

router.put(
    "/change-password",
    protect,
    userController.changePassword
);


module.exports = router;

