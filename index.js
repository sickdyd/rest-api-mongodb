const config = require("config");
const morgan = require("morgan");
const express = require("express");
const app = express();
const Joi = require("joi");
const helmet = require("helmet");

const logger = require("./logger");
const authenticate = require("./authenticate");

// config

console.log(process.env.NODE_ENV);
console.log(process.env.vidly_password);
console.log(app.get("env"));
 
console.log("Application Name: " + config.get("name"));
console.log("Mail server: " + config.get("mail.host"));
console.log("Application password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));
app.use(helmet());

app.use(logger);
app.use(authenticate);

const genres = [
  {
    id: 0,
    genre: "horror"
  },
  {
    id: 1,
    genre: "action"
  },
  {
    id: 2,
    genre: "sci-fi"
  },
  {
    id: 3,
    genre: "drama"
  },
]

function validateGenre(genre) {
  const schema = {
    genre: Joi.string().min(3).required(),
  }
  return Joi.validate(genre, schema);
}

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.put("/api/genres/:id", (req, res) => {

  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) res.status(400).send("The genre with the given ID was not found.");

  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  genre.genre = req.body.genre;
  res.send(genre);
});

app.post("/api/genres", (req, res) => {

  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const genre = {
    id: genres.length + 1,
    genre: req.body.genre,
  }

  genres.push(genre);
  res.send(genre);
});

app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) res.status(400).send("The genre with the given ID was not found.");

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
})

const port = process.env.port || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));