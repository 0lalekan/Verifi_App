import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const specialistDetailsSchema = new Schema(
  {
    medicalLicenseNumber: {
      type: String,
      required: function () {
        return this.parent() && this.parent().role === 'specialist';
      },
    },
    specialty: {
      type: String,
      required: function () {
        return this.parent() && this.parent().role === 'specialist';
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['patient', 'nurse', 'specialist', 'pharmacist', 'admin'],
      default: 'patient',
    },
    isActive: { type: Boolean, default: true },
    points: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    specialistDetails: specialistDetailsSchema,
  },
  { timestamps: true }
);

// Hide sensitive fields when converting to JSON
userSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

// Pre-save hook: hash password if modified
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

// Instance method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (err) {
    // In case of error, don't leak details; return false
    return false;
  }
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
