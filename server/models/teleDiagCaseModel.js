import mongoose from 'mongoose';

const { Schema } = mongoose;

const finalReportSchema = new Schema(
  {
    diagnosis: { type: String },
    recommendation: { type: String },
    submittedAt: { type: Date },
  },
  { _id: false }
);

const chatEntrySchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const teleDiagCaseSchema = new Schema(
  {
    referringNurse: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A referring nurse is required.'],
    },
    patientIdentifier: {
      type: String,
      required: [true, 'A patient identifier is required.'],
      trim: true,
    },
    symptoms: {
      type: String,
      required: [true, 'Symptoms are required.'],
    },
    caseNotes: { type: String },
    attachments: [{ type: String }],
    specialtyRequired: {
      type: String,
      enum: ['Radiology', 'Dermatology', 'Cardiology', 'Oncology', 'General'],
      required: [true, 'The required specialty must be specified.'],
    },
    status: {
      type: String,
      enum: ['Open', 'Under-Review', 'Closed', 'Pending-Info'],
      default: 'Open',
    },
    assignedSpecialist: { type: Schema.Types.ObjectId, ref: 'User' },
    finalReport: finalReportSchema,
    chatLog: [chatEntrySchema],
  },
  { timestamps: true }
);

const TeleDiagCase = mongoose.models.TeleDiagCase || mongoose.model('TeleDiagCase', teleDiagCaseSchema);

export default TeleDiagCase;