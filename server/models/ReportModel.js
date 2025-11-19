import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  productName: { type: String, required: true },
  batchNumber: { type: String },
  location: { type: String, required: true },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  description: { type: String, required: true },
  evidenceImage: { type: String },
  status: { type: String, enum: ['Pending', 'Investigating', 'Resolved', 'Rejected'], default: 'Pending' },
  adminNotes: { type: String }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
