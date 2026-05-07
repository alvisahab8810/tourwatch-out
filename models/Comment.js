import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    blogSlug:  { type: String, required: true, index: true },
    blogTitle: { type: String, default: "" },
    name:      { type: String, required: true },
    email:     { type: String, required: true },
    body:      { type: String, required: true },
    status:    { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
  },
  { timestamps: true }
);

delete mongoose.models.Comment;
export default mongoose.model("Comment", CommentSchema);
