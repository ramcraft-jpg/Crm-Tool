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

  // Accept preflight and health check OPTIONS requests for /api/auth/* endpoints
  if (req.method === "OPTIONS") {
    // Let CORS preflights and health checks pass through middleware
    return res.sendStatus(204);
  }

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header: "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token using JWT secret
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        // Handle failed to fetch scenarios if jwt.verify fails due to internal errors or DB/network issues
        if (
          error.message &&
          error.message.toLowerCase().includes("failed to fetch")
        ) {
          return res.status(502).json({
            message: "Could not connect to authentication service or database. (failed to fetch)",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
          });
        }
        throw error;
      }

      // Attach user to request (exclude password)
      let user;
      try {
        user = await User.findById(decoded.id).select("-password");
      } catch (error) {
        // Explicitly handle failed to fetch scenarios for DB lookups
        if (
          error.message &&
          error.message.toLowerCase().includes("failed to fetch")
        ) {
          return res.status(502).json({
            message: "Could not connect to database for user lookup. (failed to fetch)",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
          });
        }
        throw error;
      }

      if (!user) {
        return res.status(401).json({ message: "User not found. Unauthorized." });
      }

      req.user = user;
      return next(); // Proceed to the protected route

    } catch (error) {
      // Special handling for fetch/database errors already handled above.
      if (
        error.message &&
        error.message.toLowerCase().includes("failed to fetch")
      ) {
        return res.status(502).json({
          message: "Could not connect to authentication service or database. (failed to fetch)",
          error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
      }
      console.error("JWT Error:", error.message);
      return res.status(401).json({ message: "Not authorized. Token failed." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized. No token provided." });
  }
};

module.exports = { protect };
