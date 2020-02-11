const {Customer, validate} = require("../models/customer");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

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

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  console.log("This is the error", error);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  await customer.save();
  res.status(200).send(customer);
});

router.put("/:id", async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID is not valid.");
  const { error } = validate(req.body);
  console.log(req.body, error);
  if (error) return res.status(400).send(error.details[0].message);
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

router.delete("/:id", async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID is not valid.");
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(400).send("The genre with the given ID was not found.");
  res.status(200).send(customer)
});

module.exports = router;