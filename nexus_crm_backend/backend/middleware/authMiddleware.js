// =============================================
//      NEXUS CRM - AUTH MIDDLEWARE (JWT)
// =============================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect Middleware - Verifies JWT token from Authorization header.
 * Usage: Add `protect` as middleware to any route that needs authentication.
 *
 * Frontend must send:
 *   Authorization: Bearer <token>
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header: "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found. Unauthorized." });
      }

      next(); // Proceed to the protected route

    } catch (error) {
      console.error("JWT Error:", error.message);
      return res.status(401).json({ message: "Not authorized. Token failed." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized. No token provided." });
  }
};

module.exports = { protect };
