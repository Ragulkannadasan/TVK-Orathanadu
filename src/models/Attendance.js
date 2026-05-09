import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: String,
  userRole: String,
  panchayat: String,
  boothNumber: String,
  event: {
    type: String,
    default: 'General Meeting', // Can be expanded for multiple events
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scannedAt: {
    type: Date,
    default: Date.now,
  }
});

// Prevent duplicate attendance for the same event on the same day
AttendanceSchema.index({ userId: 1, event: 1, scannedAt: 1 });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
