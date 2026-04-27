import mongoose from "mongoose";

const SnippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    code: {
      type: String,
      required: [true, "Please provide the code"],
    },
    notes: {
      type: String,
    },
    timeComplexity: {
      type: String,
      default: "O(1)",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Snippet || mongoose.model("Snippet", SnippetSchema);
