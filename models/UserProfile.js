const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  name: String,
  email: String,
  github: String,
  skills: [String],
  projects: [
    {
      title: String,
      description: String,
      link: String
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("UserProfile", userProfileSchema);
