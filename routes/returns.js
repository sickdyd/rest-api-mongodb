const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {Rental, validateRental} = require("../models/rental");
const {Movie} = require("../models/movie");
const validate = require("../middleware/validate");

router.post("/", [auth, validate(validateRental)], async (req, res) => {

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental not found.");
  if (rental.dateReturned) return res.status(400).send("Return already processed.")
  
  rental.return();
  await rental.save();

  await Movie.update({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });

  return res.status(200).send(rental);
});

module.exports = router;