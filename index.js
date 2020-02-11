const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
// Allows to specify custom console log messages with
// $env:DEBUG="app:startup" (use comma for multiple or app:*)
const debug = require("debug")("app:startup");
// Uses the config npm package that allows to set config files
// for different environments (dev/testing/staging/prod)
const config = require("config");
// Morgan logs requests
const morgan = require("morgan");
// Helmet set HTTP headers that increase security
const helmet = require("helmet");
// Custom middlewares
const logger = require("./middleware/logger");
const authenticate = require("./middleware/authenticate");
// Routes
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const home = require("./routes/home");
// Init express
const express = require("express");
const app = express();

// Connect to the mongo DB
mongoose.connect("mongodb://localhost:27017/rest-api-mongodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(()=>console.log("Connected to mongoDB."))
  .catch(err => console.log("Could not connect to mongoDB."))

// console.log(process.env.NODE_ENV);
// console.log(process.env.vidly_password);
// console.log(app.get("env"));
 
console.log("Application Name: " + config.get("name"));
// console.log("Mail server: " + config.get("mail.host"));
// console.log("Application password: " + config.get("mail.password"));

// app.get("something") is equivalent to process.env.something
// Show morgan requests logging only in dev environment
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

// Set pug as view engine (to render pages)
app.set("view engine", "pug");
// Contains the pug files that can be used to render html
app.set("views", "./views");

// Allows to parse incoming data (JSON)
app.use(express.json());
// Allows to parse incoming data (form)
app.use(express.urlencoded({ extended: true }));
// Contains static files
app.use(express.static("static"));
// Use helmet secure HTTP headers
app.use(helmet());

// Set routes
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/", home);

// Use custom middleware
app.use(logger);
app.use(authenticate);

// Check if the private key for tokens is set
if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined in the ENV variables.")
  process.exit(1);
}
// If no env port is specified, use 3000
const port = process.env.port || 3000;

// Listen for incoming requests
app.listen(port, () => console.log(`Listening on port ${port}...`));