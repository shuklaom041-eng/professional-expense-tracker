const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async function (req, res, next) {
    try {
        // Get Authorization header
        const authHeader = req.headers.authorization;

        // Check if header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }

        // Check Bearer format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user
        const user = await User.findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Attach user to request
        req.user = user;

        // Continue to protected route
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = protect;