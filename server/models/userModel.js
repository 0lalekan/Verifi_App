import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const organizationDetailsSchema = new Schema(
  {
    orgName: { type: String, default: '' },
    orgAddress: { type: String, default: '' },
    orgLicense: { type: String, default: '' },
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
    profileImage: { type: String },
    role: {
      type: String,
      enum: ['consumer', 'manufacturer', 'regulator'],
      default: 'consumer',
    },
    isActive: { type: Boolean, default: true },
    points: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    // Ensure this defaults to an empty object so fields exist
    organizationDetails: { type: organizationDetailsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.password;
    return ret;
  },
});

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