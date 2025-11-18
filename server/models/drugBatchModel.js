import mongoose from 'mongoose';

const { Schema } = mongoose;

const drugBatchSchema = new Schema(
  {
    batchNumber: {
      type: String,
      required: [true, 'A batch number is required.'],
      unique: true,
      index: true,
      trim: true,
    },
    drugName: {
      type: String,
      required: [true, 'A drug name is required.'],
    },
    // This will link to a User with role 'admin' or a future 'Organization' model
    manufacturer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
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
      enum: ['In-Transit', 'At-Pharmacy', 'Dispensed', 'Expired'],
      default: 'In-Transit',
    },
    verificationCount: {
      type: Number,
      default: 0,
    },
    medicalDetails: {
      description: String,
      dosage: String,
      sideEffects: String,
      activeIngredients: String,
      manufacturedBy: String,
    },
    custodyChain: [
      {
        handlerId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        handlerRole: {
          type: String,
          enum: ['distributor', 'pharmacist'],
        },
        scannedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DrugBatch = mongoose.models.DrugBatch || mongoose.model('DrugBatch', drugBatchSchema);

export default DrugBatch;
