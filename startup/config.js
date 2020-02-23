// Uses the config npm package that allows to set config files
// for different environments (dev/testing/staging/prod)
const config = require("config");

// Check if the private key for tokens is set
module.exports = function() {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined in the ENV variables.")
  }
}