const {Genre, validateGenre} = require("../models/genre");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validate");

// Get the list of genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.status(200).send(genres);
});

// Get the one genre
router.get("/:id", validateObjectId, async (req, res) => {
  // const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  // if (!validId) return res.status(400).send("The ID is not valid.");
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("The genre with the given ID was not found.");
  res.status(200).send(genre);
});

// Add a genre
router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  // Create the new genre, save it and send the result
  const genre = new Genre({ name: req.body.name });
  await genre.save();
  res.status(200).send(genre);
});

// Edit one genre
router.put("/:id", [auth, validate(validateGenre)], async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID is not valid.");
  // Set new: true to get the updated document
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true,
    useFindAndModify: false
  });
  // If the function returns null the provided ID was not found
  if (!genre) return res.status(400).send("The genre with the given ID was not found.");
  res.status(200).send(genre);
});

// Delete genre
router.delete("/:id", [auth, admin], async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID is not valid.");
  // Find a document by id, delete it and sent the result
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(400).send("The genre with the given ID was not found.");
  res.status(200).send(genre)
});

module.exports = router;