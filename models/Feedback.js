import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    feedback: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    category: { type: String, enum: ['Bug', 'Feature Request', 'General'], default: 'General' },
  },
  { timestamps: true }
);

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
