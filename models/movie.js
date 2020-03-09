const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require('joi-objectid')(Joi);
const {genreSchema} = require("./genre");

// Define a schema for the movie document
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlehgth: 2,
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
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required()
  })
  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;
exports.movieSchema = movieSchema;