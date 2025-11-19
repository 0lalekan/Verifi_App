import mongoose from 'mongoose';

const { Schema } = mongoose;

const productBatchSchema = new Schema(
  {
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
    // Link to the Manufacturer who created this batch
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
    // UPDATED: Generic Statuses for any industry
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Recalled', 'Investigating'],
      default: 'Active',
    },
    verificationCount: {
      type: Number,
      default: 0,
    },
    // Flexible map for details like "Ingredients", "Material", "Origin" etc.
    productAttributes: {
      type: Map,
      of: String,
    },
    // Optional: Track scan history locations if needed for advanced analytics
    scanHistory: [
      {
        scannedAt: { type: Date, default: Date.now },
        location: { type: String } // Geo-coordinates or region
      }
    ]
  },
  {
    timestamps: true,
  }
);

const ProductBatch = mongoose.models.ProductBatch || mongoose.model('ProductBatch', productBatchSchema);

export default ProductBatch;