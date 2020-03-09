const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {User, validateUser} = require("../models/user");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

router.get("/me", auth, async (req, res) => {
  // The auth middleware verify the validity of the token
  // and adds the object user to the request, allowing
  // to access the user id with req.user._id
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
})

router.post("/", validate(validateUser), async (req, res) => {
  let user = await User.exists({ email: req.body.email });
  if (user) return res.status(400).send("The email is already in use.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  // const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  const token = user.generateAuthToken();
  // Since the jwt is not a property of the user we send it in a header
  // This way once the user registered he will be automatically logged in
  res.header("x-auth-token", token).status(200).send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;