import mongoose from 'mongoose';

const GrievanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Agriculture', 'Water', 'Road', 'Electricity', 'Other'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Investigating', 'Resolved'],
    default: 'Pending',
  },
  panchayat: String,
  boothNumber: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Grievance || mongoose.model('Grievance', GrievanceSchema);
