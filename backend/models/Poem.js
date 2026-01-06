import mongoose from "mongoose";

const { Schema } = mongoose;

const poemSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    visibility: { type: Boolean, default: true },
    tags: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    aiInsight: { type: String },
    // Mongoose handles timestamps automatically if you use the option below,
    // but explicit fields work too.
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    // Enable Virtuals
    // This tells Mongoose: "When converting to JSON, include fields that aren't stored in the DB"
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// This lets you use .populate('reviews')
poemSchema.virtual("reviews", {
  ref: "Review", // Model name
  localField: "_id", // Matches Poem's _id
  foreignField: "poem", // Matches 'poem' field in ReviewSchema
  justOne: false, // Returns an array
});

// Add Virtual for 'discussions'
// This lets you use .populate('discussions')
poemSchema.virtual("discussions", {
  ref: "Discussion", // Model name
  localField: "_id", // Matches Poem's _id
  foreignField: "poem", // Matches 'poem' field in DiscussionSchema
  justOne: false, // Returns an array
});

export default mongoose.model("Poem", poemSchema);
