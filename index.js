const express = require("express");
const app = express();
const helmet = require("helmet");

const logger = require("./startup/logging");
require("./startup/routes")(app);
require("./startup/database")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/console")(app);

app.set("view engine", "pug");
// Contains the pug files that can be used to render html
app.set("views", "./views");
// Allows to parse incoming data (form)
app.use(express.urlencoded({ extended: true }));
// Contains static files
app.use(express.static("static"));
// Use helmet secure HTTP headers
app.use(helmet());

const port = process.env.port || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));