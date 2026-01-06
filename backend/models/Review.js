import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema({
  poem: { type: Schema.Types.ObjectId, ref: "Poem" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date },
});

export default mongoose.model("Review", reviewSchema);
