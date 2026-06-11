import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    userId:   { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar:   { type: String, default: '' },
    channels: [{ type: String }],
  },
  { timestamps: true }
);

/**
 * Pre-save hook: hash password before saving if it was modified.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

export default mongoose.model('User', userSchema);
