const mongoose = require("mongoose");
const Joi = require("joi");

// Define a schema for the movie document
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlehgth: 5,
    maxlength: 50
  },
  genre: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
      required: true
    },
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 55,
    }
  },
  numberInStock: {
    type: Number,
    default: 0
  },
  dailyRentalRate: {
    type: Number,
    default: 0
  }
});

// Define a model (class) for the movie document
const Movie = mongoose.model("Movie", movieSchema); 

// Use Joi to validate data
function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(55).required(),
    genre: {
      id: Joi.string().required(),
      name: Joi.string().min(5).max(55).required()
    },
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required()
  }
  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;