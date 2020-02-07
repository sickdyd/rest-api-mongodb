const express = require("express");
const router = express.Router();

const Joi = require("joi");

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

// Get the list of genres
router.get("/", (req, res) => {
  res.send(genres);
});

// Edit one genre
router.put("/:id", (req, res) => {

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

// Add a genre
router.post("/", (req, res) => {

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

// Delete genre
router.delete("/:id", (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) res.status(400).send("The genre with the given ID was not found.");

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
})

module.exports = router;