const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, required: false },
  profilePicture: { type: String, required: false },
  joinedDate: { type: Date, default: Date.now },
  totalLikes: { type: Number, default: 0 },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poem" }],
});

module.exports = mongoose.model("User", User);
