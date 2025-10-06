export interface User {
  _id?: string;
  email: string;
  password: string;
  totpSecret?: string;
  is2FAEnabled: boolean;
  createdAt: Date;
}

export interface VaultItem {
  _id?: string;
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

export interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeLookalikes: boolean;
}
