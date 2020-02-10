const {Movie, validate} = require("../models/movie");
const express = require("express");
const router = express.Router();

// Get the list of genres
router.get("/", async (req, res) => {
  const movies = await Movie
    .find()
    .sort("title")
    .populate("name")
  res.status(200).send(movies);
});

// Get the one movie
router.get("/:id", async (req, res) => {
  const movie = await Movie
    .findById(req.params.id)
  if (!movie) return res.status(400).send("The movie with the given ID was not found.");
  res.status(200).send(movie);
});

// Add a movie
router.post("/", async (req, res) => {
  // Validate the content of the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Create the new movie, save it and send the result
  let movie = new Movie({
    title: req.body.title,
    genre: {
      id: req.body.genre.id,
      name: req.body.genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  movie = await movie.save();
  res.status(200).send(movie);
});

// Edit one movie
router.put("/:id", async (req, res) => {
  // Validate req.body
  const { error } = validate(req.body);
  // If there is an error send it and return
  if (error) return res.status(400).send(error.details[0].message);
  // Set new: true to get the updated document
  const movie = await Movie
    .findByIdAndUpdate(req.params.id,
      {
        title: req.body.title,
        genre: {
          id: req.body.genre.id,
          name: req.body.genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      },
      {
        new: true,
        useFindAndModify: false
      }
    );
  // If the function returns null the provided ID was not found
  if (!movie) return res.status(400).send("The movie with the given ID was not found.");
  res.status(200).send(movie);
});

// Delete movie
router.delete("/:id", async (req, res) => {
  // Find a document by id, delete it and sent the result
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(400).send("The movie with the given ID was not found.");
  res.status(200).send(movie)
});

module.exports = router;