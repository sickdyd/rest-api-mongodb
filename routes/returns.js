const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {Rental, validate} = require("../models/rental");
const {Movie} = require("../models/movie");
const moment = require("moment");

const generalValidate = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next();
  }
}

router.post("/", [auth, generalValidate(validate)], async (req, res) => {
  // const { error } = validateRental(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  // let rental = await Rental.exists({ customerId: req.body.customerId, movieId: req.body.movieId });
  // if (!rental) return res.status(404).send("The rental for this customer/movie does not exist.");

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });

  if (!rental) return res.status(404).send("Rental not found.");
  if (rental.dateReturned) return res.status(400).send("Return already processed.")
  
  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();

  await Movie.update({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });

  return res.status(200).send(rental);
});

module.exports = router;