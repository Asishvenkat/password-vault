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
**Important**: 
	# Password Vault - Secure Password Manager

	A modern password manager built with Next.js 14, TypeScript, and MongoDB.

	This repository provides a starting point: client-side encryption helpers, API routes for auth and vault CRUD, and a simple UI.

	## Quick start

	1. Install dependencies:

	```bash
	npm install
	```

	2. Create `.env.local` with:

	```env
	MONGODB_URI=your-mongodb-connection-string
	JWT_SECRET=your-jwt-secret-at-least-32-chars
	NEXT_PUBLIC_APP_URL=http://localhost:3000
	```

	3. Run dev server:

	```bash
	npm run dev
	```

	4. Run smoke-test (basic API check):

	```bash
	npm run smoke-test
	```

	## Smoke test

	`scripts/api-smoke-test.js` performs a simple signup/login against the running dev server.

	## Notes

	- API implementations are basic and intended for development. Review security before production use.
	- If you see DNS errors connecting to MongoDB Atlas, verify `MONGODB_URI` and that your machine/network can resolve SRV records.
