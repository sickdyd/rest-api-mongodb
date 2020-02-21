const {Movie, validate} = require("../models/movie");
const {Genre} = require("../models/genre");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const movies = await Movie
    .find()
    .sort("title")
    // .populate("name")
  res.status(200).send(movies);
});

// Get the one movie
router.get("/:id", async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID is not valid.");
  const movie = await Movie
    .findById(req.params.id)
  if (!movie) return res.status(400).send("The movie with the given ID was not found.");
  res.status(200).send(movie);
});

// Add a movie
router.post("/", auth, async (req, res) => {
  // Validate the content of the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // If the genre does not exists send error
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");
  // Create the new movie, save it and send the result
  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  await movie.save();
  res.status(200).send(movie);
});

// Edit one movie
router.put("/:id", auth, async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID is not valid.");
  // Validate req.body
  const { error } = validate(req.body);
  // If there is an error send it and return
  if (error) return res.status(400).send(error.details[0].message);
  // If the genre does not exists send error
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");
  // Set new: true to get the updated document
  const movie = await Movie
    .findByIdAndUpdate(req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
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
router.delete("/:id", auth, async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID is not valid.");
  // Find a document by id, delete it and sent the result
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(400).send("The movie with the given ID was not found.");
  res.status(200).send(movie)
});

module.exports = router;