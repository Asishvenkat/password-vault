import mongoose, { Document, Schema } from 'mongoose';

// MongoDB User Model with 2FA support
export interface IUser extends Document {
  email: string;
  password: string; // Hashed with bcryptjs
  totpSecret?: string; // TOTP secret for 2FA
  is2FAEnabled: boolean; // Whether 2FA is enabled
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  totpSecret: {
    type: String,
    required: false
  },
  is2FAEnabled: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
