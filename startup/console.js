// Allows to specify custom console log messages with
// $env:DEBUG="app:startup" (use comma for multiple or app:*)
const debug = require("debug")("app:startup");
// Morgan logs requests
const morgan = require("morgan");

module.exports = function(app) {
  // app.get("something") is equivalent to process.env.something
  // Show morgan requests logging only in dev environment
  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Morgan enabled...");
  }
}