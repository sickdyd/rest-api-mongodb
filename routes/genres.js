const {Genre, validate} = require("../models/genre");
const express = require("express");
const router = express.Router();

// Get the list of genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.status(200).send(genres);
});

// Get the one genre
router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(400).send("The genre with the given ID was not found.");
  res.status(200).send(genre);
});

// Add a genre
router.post("/", async (req, res) => {
  // Validate the content of the request
  console.log(req.body);
  
  const { error } = validate(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);
  // Create the new genre, save it and send the result
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.status(200).send(genre);
});

// Edit one genre
router.put("/:id", async (req, res) => {
  // Validate req.body
  const { error } = validate(req.body);
  // If there is an error send it and return
  if (error) return res.status(400).send(error.details[0].message);
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
router.delete("/:id", async (req, res) => {
  // Find a document by id, delete it and sent the result
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(400).send("The genre with the given ID was not found.");
  res.status(200).send(genre)
});

module.exports = router;