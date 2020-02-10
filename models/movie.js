const mongoose = require("mongoose");
const Joi = require("joi");
const {genreSchema} = require("./genre");

// Define a schema for the movie document
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlehgth: 5,
    maxlength: 255
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  }
});

// Define a model (class) for the movie document
const Movie = mongoose.model("Movie", movieSchema); 

// Use Joi to validate data
function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(255).required(),
    genre: Joi.string().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required()
  }
  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;