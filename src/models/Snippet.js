import mongoose from "mongoose";

const SnippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    code: {
      type: String,
      required: [true, "Please provide the code"],
      maxlength: [50000, "Code cannot exceed 50000 characters"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    timeComplexity: {
      type: String,
      default: "O(1)",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["Graph", "DP", "Math", "String", "Data Structure", "Geometry", "Number Theory", "Greedy", "Other"],
      default: "Other",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Text index for fast search
SnippetSchema.index({ title: "text", tags: "text" });

export default mongoose.models.Snippet || mongoose.model("Snippet", SnippetSchema);
