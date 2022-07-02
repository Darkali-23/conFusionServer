const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema({
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    default: "",
  },
  facebookId: String,
  admin: {
    type: Boolean,
    default: false,
  },
});

var newUser = User.plugin(passportLocalMongoose);
const userModel = mongoose.model("User", newUser);

module.exports = userModel;
