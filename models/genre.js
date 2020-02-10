const mongoose = require("mongoose");
const Joi = require("joi");

// Define a schema for the genre document
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlehgth: 5,
    maxlength: 50
  }
});

// Define a model (class) for the genre document
const Genre = mongoose.model("Genre", genreSchema); 

// Use Joi to validate data
function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(5).max(55).required(),
  }
  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;