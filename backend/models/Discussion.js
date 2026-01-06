import mongoose from "mongoose";

const { Schema } = mongoose;

const discussionSchema = new Schema({
  poem: { type: Schema.Types.ObjectId, ref: "Poem" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  createdAt: { type: Date },
});

export default mongoose.model("Discussion", discussionSchema);
