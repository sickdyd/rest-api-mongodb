const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
// This will forward the error in the pipeline to our error handler
require("express-async-errors");

// Manually throwing the exception will let winston handle the logging
process.on("unhandledRejection", (ex) => {
  throw ex;
});

// Log to files
const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({filename: "./logs/combined.log", level: "verbose"}),
  ],
  transports: [
    new transports.File({filename: "./logs/error.log", level: "error"}),
    new transports.File({filename: "./logs/combined.log"}),
  ],
  exceptionHandlers: [
    new transports.File({ filename: "./logs/exceptions.log" }),
    new transports.File({ filename: "./logs/combined.log" }),
  ],
  handleExceptions: true,
});

// Log to database
logger.add(new transports.MongoDB({
  level: "error",
  db: "mongodb://localhost:27017/rest-api-mongodb",
  options: {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  metaKey: "stack",
  handleExceptions: true,
}));

// This is used to make the console logging more readable
// Enabled only in development
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === undefined) {
  const consoleFormat = format.printf(function(info) {
    //console.log(info);
    return `${info.timestamp} - ${info.level}: ${JSON.stringify(info.message, null, 4)}`;
  });
  
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }), consoleFormat),
    level: "debug",
    handleExceptions: true,
    colorize: true,
    prettyPrint: true
  }));
}

module.exports = logger;