import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  username: {
    type: String,
    unique: true,
    sparse: true, // Allow nulls for old users but must be unique if present
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  role: {
    type: String,
    enum: ['Voter', 'Poruppalar', 'Admin', 'MLA', 'DistSecretary'],
    default: 'Voter',
  },
  mobile: String,
  voterId: String,
  panchayat: String,
  boothNumber: String,
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
