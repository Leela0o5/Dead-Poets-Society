import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const User = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, required: false },
  profilePicture: { type: String, required: false },
  joinedDate: { type: Date, default: Date.now },
  totalLikes: { type: Number, default: 0 },
  favorites: [{ type: _Schema.Types.ObjectId, ref: "Poem" }],
});

export default model("User", User);
