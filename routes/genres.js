const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

// Connect to the mongo DB
mongoose.connect("mongodb://localhost/rest-api-mongodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log("Connected to mongoDB.");
});

// Define a schema for the genre document
const genreSchema = new mongoose.Schema({
  genre: String,
});

// Define a model (class) for the genre document
const Genre = mongoose.model("Genre", genreSchema); 

// Use Joi to validate data
function validateGenre(genre) {
  const schema = {
    genre: Joi.string().min(3).required(),
  }
  return Joi.validate(genre, schema);
}

// Get the list of genres
router.get("/", (req, res) => {
  Genre.find({})
    .then(genres => res.status(200).send(genres))
    .catch(err => res.statys(400).send(err))
});

// Edit one genre
router.put("/:id", (req, res) => {
  // Retrieve the genre from the table
  Genre.findById(req.params.id)
    .then(genre => {
      console.log(genre);
      // If the function returns null the provided ID was not found
      if (!genre) res.status(400).send("The genre with the given ID was not found.");
      // Validate the content of the request
      const { error } = validateGenre(req.body);
      // If there is an error send it and return
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }
      // If the ID was foud and no errors were given save the document
      genre.set({ genre: req.body.genre });
      genre.save();
      // Send the new saved document to the client
      res.send(genre);
    })
    // Handle error for the findGenreById function
    .catch(err => res.status(400).send(err.message));
});

// Add a genre
router.post("/", (req, res) => {
  // Validate the content of the request
  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  // Create the new object containing the values of the new genre
  const genre = {
    // id: genres.length + 1,
    genre: req.body.genre,
  }
  // Create the new genre, save it and send the result
  const newGenre = new Genre(genre);
  newGenre.save()
    .then(genre => res.status(200).send(genre))
    .catch(err => res.status(400).send(err.message))
});

// Delete genre
router.delete("/:id", (req, res) => {
  // Find a document by id, delete it and sent the result
  Genre.findByIdAndDelete(req.params.id)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).send("Could not find the genre with the ID provided."));
})

module.exports = router;