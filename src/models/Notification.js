import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'announcement'],
    default: 'info',
  },
  targetRole: {
    type: String,
    enum: ['All', 'Admin', 'Poruppalar', 'Voter'],
    default: 'All',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  isSystem: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
