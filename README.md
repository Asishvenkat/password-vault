#  Password Vault - Secure Password Manager

A modern, full-stack password manager built with Next.js 14, TypeScript, MongoDB, and client-side AES-256 encryption.

##  Live Demo

Check out the live application: [https://password-vault-hazel.vercel.app/](https://password-vault-hazel.vercel.app/)

## ✨ Features

### Core Features
-  **Strong Password Generator**
  - Configurable length (8-32 characters)
  - Include/exclude numbers, symbols, look-alike characters
  - Cryptographically secure random generation

-  **Secure Vault**
  - Client-side AES-256 encryption (server never sees plaintext)
  - Full CRUD operations (Create, Read, Update, Delete)
  - Store: title, username, password, URL, notes

-  **Two-Factor Authentication (2FA)**
  - TOTP-based 2FA using authenticator apps (Google Authenticator, Authy, etc.)
  - QR code setup for easy configuration
  - Enable/disable 2FA in settings
  - Secure verification during login

-  **User Experience**
  - Real-time search and filter
  - Copy to clipboard with 15-second auto-clear
  - Clean, responsive UI with Tailwind CSS
  - Dark mode toggle
  - Fast and minimal design

-  **Security**
  - Passwords encrypted before leaving browser
  - JWT-based authentication with HTTP-only cookies
  - Secure session management

## Screenshots

<table>
  <tr>
    <td align="center">
      <a href="https://drive.google.com/file/d/1EBdT4cTp-jDOcaMPQcucIRpB4XulLAKL/view?usp=drive_link" target="_blank">
        <img src="https://drive.google.com/uc?export=view&id=1EBdT4cTp-jDOcaMPQcucIRpB4XulLAKL" width="450"/>
      </a>
      <br/> Generate Password
    </td>
    <td align="center">
      <a href="https://drive.google.com/file/d/1cPgfgkoAKJVC3iF_3CkVnHXkSBk2eBAG/view?usp=drive_link" target="_blank">
        <img src="https://drive.google.com/uc?export=view&id=1cPgfgkoAKJVC3iF_3CkVnHXkSBk2eBAG" width="450"/>
      </a>
      <br/> View Passwords
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://drive.google.com/file/d/1EqhblR7Lxo4hjuV8WnKJ-8rjH6oVmze5/view?usp=drive_link" target="_blank">
        <img src="https://drive.google.com/uc?export=view&id=1EqhblR7Lxo4hjuV8WnKJ-8rjH6oVmze5" width="450"/>
      </a>
      <br/> Add/Edit Password
    </td>
    <td align="center">
      <a href="https://drive.google.com/file/d/1RwtFn2omvkdzb6mhZzWr07REqmTzu8i5/view?usp=drive_link" target="_blank">
        <img src="https://drive.google.com/uc?export=view&id=1RwtFn2omvkdzb6mhZzWr07REqmTzu8i5" width="450"/>
      </a>
      <br/> Enable 2FA(TOTP)
    </td>
  </tr>
</table>


## Quick Start

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

## Smoke Test

`scripts/api-smoke-test.js` performs a simple signup/login against the running dev server.

## Scripts

- `npm run smoke-test` - Run API smoke test
- `npm run check-2fa` - Check 2FA functionality
- `npm run seed-data` - Seed database with sample data
- `npm run test-db` - Test database connection
- `npm run validate-env` - Validate environment variables

## Notes

- API implementations are basic and intended for development. Review security before production use.
- If you see DNS errors connecting to MongoDB Atlas, verify `MONGODB_URI` and that your machine/network can resolve SRV records.
- 2FA uses the `speakeasy` library for TOTP generation and verification.
