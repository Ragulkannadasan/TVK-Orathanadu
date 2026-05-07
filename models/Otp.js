import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
}, { timestamps: true });

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema);
