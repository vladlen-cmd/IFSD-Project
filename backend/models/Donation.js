import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    required: true,
    enum: ['education', 'healthcare', 'environment', 'emergency']
  },
  donorName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed' // For now, since we're not integrating with real payment gateway
  },
  transactionId: {
    type: String,
    unique: true
  },
  paymentMethod: {
    type: String,
    default: 'online'
  },
  currency: {
    type: String,
    default: 'INR'
  }
}, {
  timestamps: true
});

// Generate unique transaction ID before saving
donationSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next();
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;