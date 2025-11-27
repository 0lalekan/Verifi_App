import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    locationAccuracy: { type: Number, default: 0 },
  },
  { _id: false }
);

const verificationLogSchema = new Schema(
  {
    productBatch: { type: String, required: true },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      // FIX: Added 'Suspicious' to this list
      enum: ['Valid', 'Fake', 'Expired', 'Unknown', 'Suspicious', 'Recalled'],
      required: true,
    },
    location: { type: locationSchema, required: true },
    deviceInfo: { type: String, required: true },
    ipLocation: { type: String } // Added optional field for IP location we saw in controller
  },
  { timestamps: true }
);

const VerificationLog =
  mongoose.models.VerificationLog || mongoose.model('VerificationLog', verificationLogSchema);

export default VerificationLog;