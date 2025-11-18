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
      enum: ['Valid', 'Fake', 'Expired', 'Unknown'],
      required: true,
    },
    location: { type: locationSchema, required: true },
    deviceInfo: { type: String, required: true },
  },
  { timestamps: true }
);

const VerificationLog =
  mongoose.models.VerificationLog || mongoose.model('VerificationLog', verificationLogSchema);

export default VerificationLog;
