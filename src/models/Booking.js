import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled'],
    default: 'Confirmed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Ensure a user can only have one seat per event
BookingSchema.index({ eventId: 1, userId: 1 }, { unique: true });
// Ensure a seat is only assigned once per event
BookingSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
