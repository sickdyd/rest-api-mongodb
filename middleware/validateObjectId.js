const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(404).send("The ID is not valid.");

  next();
}