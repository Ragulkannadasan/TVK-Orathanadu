import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: String,
  userEmail: String,
  category: {
    type: String,
    enum: ["Suggestion", "Bug Report", "Appreciation", "Other"],
    default: "Suggestion",
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Action Taken"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
