/*
# 🔐 Password Vault - Secure Password Manager

A modern, full-stack password manager built with Next.js 14, TypeScript, MongoDB, and client-side AES-256 encryption.

## ✨ Features

### Core Features
- 🔑 **Strong Password Generator**
	- Configurable length (8-32 characters)
	- Include/exclude numbers, symbols, look-alike characters
	- Cryptographically secure random generation
  
- 🔒 **Secure Vault**
	- Client-side AES-256 encryption (server never sees plaintext)
	- Full CRUD operations (Create, Read, Update, Delete)
	- Store: title, username, password, URL, notes
  
- 🔍 **User Experience**
	- Real-time search and filter
	- Copy to clipboard with 15-second auto-clear
	- Clean, responsive UI with Tailwind CSS
	- Fast and minimal design

- 🛡️ **Security**
	- Passwords encrypted before leaving browser
	- JWT-based authentication with HTTP-only cookies
	- bcrypt password hashing
	- Zero-trust architecture

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Encryption**: crypto-js (AES-256)
- **Authentication**: JWT + bcrypt
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd password-vault

# Install dependencies
npm install
```

### 2. MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. **Database Access** → Add Database User
	 - Username: `your_username`
	 - Password: `your_password`
4. **Network Access** → Add IP Address
	 - Allow access from: `0.0.0.0/0` (for development)
5. **Connect** → Get connection string

### 3. Environment Variables

Create `.env.local` in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/passwordvault
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: 
- Replace `username` and `password` with your MongoDB credentials
- Generate a strong JWT_SECRET (minimum 32 characters)

### 4. Validate Setup

```bash
# Validate environment variables
npm run validate:env

# Test database connection
npm run test:db
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. (Optional) Seed Sample Data

```bash
npm run seed
```

This creates a demo user:
- Email: `demo@example.com`
- Password: `DemoPassword123!`

## 📁 Project Structure

```
password-vault/
├── src/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   └── vault/        # Vault CRUD endpoints
│   │   ├── dashboard/        # Protected dashboard page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Auth page (login/signup)
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   ├── lib/                  # Utilities (crypto, db, auth)
│   ├── types/                # TypeScript types
│   └── middleware.ts         # Route protection
├── scripts/                  # Utility scripts
├── .env.local               # Environment variables
└── package.json
```

## 🔐 Security & Encryption

/* README truncated in file for brevity; full README kept in repository */
*/
