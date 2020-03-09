const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

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
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  })
  return schema.validate(genre);
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genreSchema = genreSchema;