/**
 * models/Announcement.js
 * TVK Announcement schema for constituency-wide updates.
 */

import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['General', 'Urgent', 'Event', 'Update'],
      default: 'General',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
