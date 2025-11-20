import mongoose from 'mongoose';

const { Schema } = mongoose;

const productBatchSchema = new Schema(
  {
    // ... existing fields (batchNumber, productName, etc.) ...
    batchNumber: {
      type: String,
      required: [true, 'A batch number is required.'],
      unique: true,
      index: true,
      trim: true,
    },
    productName: {
      type: String,
      required: [true, 'A product name is required.'],
    },
    manufacturer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiryDate: {
      type: Date,
      required: [true, 'An expiry date is required.'],
    },
    manufacturingDate: {
      type: Date,
      required: [true, 'A manufacturing date is required.'],
    },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Recalled', 'Investigating', 'Suspicious'], // Added 'Suspicious'
      default: 'Active',
    },
    verificationCount: {
      type: Number,
      default: 0,
    },
    // --- NEW FIELD ---
    maxScansAllowed: {
      type: Number,
      required: true,
      default: 1000, // Default fallback
      description: "The estimated threshold before this batch is flagged as cloned"
    },
    // -----------------
    productAttributes: {
      type: Map,
      of: String,
    },
    scanHistory: [
      {
        scannedAt: { type: Date, default: Date.now },
        location: { type: String }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const ProductBatch = mongoose.models.ProductBatch || mongoose.model('ProductBatch', productBatchSchema);

export default ProductBatch;