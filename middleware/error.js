// Winston is a logger, it allows to store errors in a log and mongoDB
const logger = require("../startup/logging");

// This function will handle all errors in the router
// It works thanks to require("express-async-errors"); that forwards the error in the pipeline

// It does not work outside of the context of express
module.exports = function (err, req, res, next) {
  logger.error(err.message, err);
  // error, warn, info, berbose, debug, silly
  res.status(500).send("Something on the server failed.");
}