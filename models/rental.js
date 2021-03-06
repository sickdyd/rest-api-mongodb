const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require('joi-objectid')(Joi);
const moment = require("moment");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 255,
        required: true
      },
      dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
        required: true
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    default: Date.now,
    required: true
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

rentalSchema.methods.return = function() {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

rentalSchema.statics.lookup = function(customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
}

const Rental = mongoose.model("Rental", rentalSchema)

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  })
  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validateRental = validateRental;