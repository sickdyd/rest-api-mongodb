const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fawn = require("fawn");
const {Rental, validate} = require("../models/rental");
const {Movie} = require("../models/movie");
const {Customer} = require("../models/customer");
const auth = require("../middleware/auth");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.status("200").send(rentals);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("The customer selected is not in the database.");

  const movie = await Movie.findById(req.body.movieId)
  if (!movie) return res.status(400).send("The movie selected is not in the database.");

  if (movie.numberInStock === 0) return res.status(400).send("Movie not available.");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  })

  // Fawn allows to create a 2 phase transaction
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, {
        $inc: { numberInStock: -1 }
      })
      .run();

    res.status(200).send(rental);
  }
  catch(ex) {
    res.status(500).send("Something fail.");
  }

})

module.exports = router;