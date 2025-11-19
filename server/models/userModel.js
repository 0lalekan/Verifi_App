import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

// Details specific to Manufacturers/Distributors
const organizationDetailsSchema = new Schema(
  {
    orgName: { type: String },
    orgAddress: { type: String },
    orgLicense: { type: String }, // e.g. RC Number or NAFDAC ID
    isVerified: { type: Boolean, default: false },
    subscriptionStatus: { type: String, enum: ['free', 'paid'], default: 'free' }
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    profileImage: { type: String }, // URL to upload
    role: {
      type: String,
      enum: ['consumer', 'manufacturer', 'regulator'], // The only 3 valid roles
      default: 'consumer',
    },
    isActive: { type: Boolean, default: true },
    points: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    
    // Embedded schema for manufacturer details
    organizationDetails: organizationDetailsSchema,
  },
  { timestamps: true }
);

// Hide sensitive fields
userSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.password;
    return ret;
  },
});

// Hash password pre-save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;