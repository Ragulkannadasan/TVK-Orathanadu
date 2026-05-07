/**
 * models/Grievance.js
 * Grievance/complaint schema for TVK members.
 */

import mongoose from 'mongoose';

const GrievanceSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['Agriculture', 'Water', 'Road', 'Electricity', 'Other'],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    status: {
      type: String,
      enum: ['Pending', 'Investigating', 'Resolved'],
      default: 'Pending',
    },
    actionNotes: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Grievance ||
  mongoose.model('Grievance', GrievanceSchema);
