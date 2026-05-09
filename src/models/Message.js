import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Poruppalar', 'Voter'], default: 'Voter' },
  createdAt: { type: Date, default: Date.now }
});

// Index for performance and cleanup
ChatSchema.index({ createdAt: -1 });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
