const {Customer, validateCustomer} = require("../models/customer");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.status(200).send(customers);
})

router.get("/:id", async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID is not valid.");
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(400).send("Customer not found.");
  res.status(200).send(customer);
});

router.post("/", [auth, validate(validateCustomer)], async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  await customer.save();
  res.status(200).send(customer);
});

router.put("/:id",  [auth, validate(validateCustomer)], async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID is not valid.");

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    },
    { new: true, useFindAndModify: false }
  );
  if (!customer) return res.status(400).send("Customer not found.");
  res.status(200).send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID is not valid.");
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(400).send("The genre with the given ID was not found.");
  res.status(200).send(customer)
});

module.exports = router;