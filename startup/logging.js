// Winston is used for loggin
const winston = require("winston");
require("winston-mongodb");
// This will forward the error in the pipeline to our error handler
require("express-async-errors");

const myFormat = winston.format.printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

process.on("unhandledRejection", (ex) => {
  // Manually throwing the exception will let winston handle the logging
  throw ex;
});

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(winston.format.timestamp(), myFormat),  // winston.format.json(),
  transports: [
    new winston.transports.File({filename: "./logs/combined.log", level: "debug"}),
  ],
  transports: [
    new winston.transports.File({filename: "./logs/error.log", level: "error"}),
    new winston.transports.File({filename: "./logs/combined.log"}),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "./logs/exceptions.log" }),
    new winston.transports.File({ filename: "./logs/combined.log" })
  ],
  handleExceptions: true,
});

logger.add(new winston.transports.Console({
  format: winston.format.combine(winston.format.timestamp(), myFormat),
  level: "debug",
  handleExceptions: true,
  colorize: true,
  prettyPrint: true
}));

logger.add(new winston.transports.MongoDB({
  format: winston.format.combine(winston.format.timestamp(), myFormat),
  db: "mongodb://localhost:27017/rest-api-mongodb",
  options: {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  level: "debug",
  handleExceptions: true,
}));

module.exports = logger;

// To handle uncaught exceptions
// process.on("uncaughtException", (ex) => {
//   winston.error(ex.message, ex);
//   process.exit(1);
// });

// winston.ExceptionHandler(new winston.transports.File({
//   filename: "uncaughtExceptions.log"
// }));

// winston.add(new winston.transports.Console());
// winston.add(new winston.transports.File({ filename: "logfile.log" }));
// winston.add(new winston.transports.MongoDB({
//   db: "mongodb://localhost:27017/rest-api-mongodb",
//   level: "info"
// }));

// throw new Error("Something failed during startup.");