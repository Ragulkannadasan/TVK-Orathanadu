import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

MessageSchema.index({ createdAt: -1 });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
