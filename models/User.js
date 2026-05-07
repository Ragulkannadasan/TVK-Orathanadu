/**
 * models/User.js
 * TVK Voter/Member schema with RBAC roles.
 */

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    voterId: {
      type: String,
      trim: true,
      uppercase: true,
    },
    panchayat: {
      type: String,
      trim: true,
    },
    boothNumber: {
      type: Number,
    },
    role: {
      type: String,
      enum: ['Voter', 'Poruppalar', 'Admin'],
      default: 'Voter',
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
