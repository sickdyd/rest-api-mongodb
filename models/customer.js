const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  }
});

const Customer = mongoose.model("Customer", userSchema);

function validateCustomer(customer) {
  const schema = {
    isGold: Joi.boolean(),
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
  }
  return Joi.validate(customer, schema);
}

// module.exports.Customer = Customer;
exports.Customer = Customer;
exports.validate = validateCustomer;