import mongoose from "mongoose";

const { Schema } = mongoose;

const favouriteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  poem: { type: Schema.Types.ObjectId, ref: "Poem" },
  createdAt: { type: Date },
});

export default mongoose.model("Favourite", favouriteSchema);
