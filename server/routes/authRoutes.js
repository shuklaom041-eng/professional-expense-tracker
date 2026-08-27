const express = require("express");

const router = express.Router();


// Import authentication controller
const authController =
    require("../Controllers/authController");


// Authentication testing route
router.get(
    "/",
    function (req, res) {

        res.send("Authentication Controller Working");

    }
);


// Authentication status route
router.get(
    "/status",
    function (req, res) {

        res.send("Authentication System Ready");

    }
);


// User Registration
router.post(
    "/register",
    authController.registerUser
);
// User Login
router.post(
    "/login",
    authController.loginUser
);


module.exports = router;