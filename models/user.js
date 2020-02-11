const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 5,
  max: 250,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlenght: 1,
    maxlength: 55,
    required: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true
  }
})

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  // change is: wrapped everything in Joi.object
  const schema = Joi.object({
    name: Joi.string().min(1).max(55).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: passwordComplexity(complexityOptions) // This is not working
  });
  // note that we call schema.validate instead of Joi.validate
  // (which doesn't seem to exist anymore)
  return schema.validate(user);
}


exports.User = User;
exports.validate = validateUser;