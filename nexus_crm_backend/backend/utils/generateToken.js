// =============================================
//        NEXUS CRM - JWT TOKEN GENERATOR
// =============================================

const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token for a given user ID.
 * @param {string} id - The user's MongoDB _id
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

module.exports = generateToken;
