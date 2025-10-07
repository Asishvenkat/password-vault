import mongoose, { Document, Schema } from 'mongoose';

export interface IVaultItem extends Document {
  userId: string;
  title: string;
  username?: string;
  password: string; // Encrypted
  url?: string;
  notes?: string;
  tags: string[];
  folder?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VaultItemSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  username: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  folder: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.VaultItem || mongoose.model<IVaultItem>('VaultItem', VaultItemSchema);
