// =============================================
//      NEXUS CRM - ERROR HANDLING MIDDLEWARE
// =============================================

/**
 * 404 Not Found Handler
 * Triggered when no route matches the request.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global Error Handler
 * Catches all errors thrown in controllers.
 * Returns JSON error response (not HTML).
 */
const errorHandler = (err, req, res, next) => {
  // Sometimes Express sets status 200 on errors - default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Show stack trace only in development mode
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
