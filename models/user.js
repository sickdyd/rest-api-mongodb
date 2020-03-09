const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

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
    minlenght: 2,
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
  },
  isAdmin: Boolean,
  // Sub roles and privileges
  // roles: [],
  // What the user is allowed to perform
  // ex. create genres / delete genres
  // operations: []
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
  return token;
}

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  // change is: wrapped everything in Joi.object
  const schema = Joi.object({
    name: Joi.string().min(2).max(55).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: passwordComplexity(complexityOptions)
  });
  // note that we call schema.validate instead of Joi.validate
  // (which doesn't seem to exist anymore)
  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;