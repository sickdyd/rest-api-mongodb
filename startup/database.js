const mongoose = require("mongoose");
const logger = require("../startup/logging");

module.exports = function() {
  mongoose.connect("mongodb://localhost:27017/rest-api-mongodb", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true, 
  })
    .then(()=>logger.info("Connected to mongoDB."));
}