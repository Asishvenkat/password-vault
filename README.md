Password Vault – Secure Password Manager (MVP)

Live Demo
- Password Vault - Secure Password Manager

Overview
A minimal, privacy-first password manager built with Next.js and TypeScript. It lets you generate strong passwords, encrypt them client-side, and store the ciphertext in MongoDB. The server never sees your plaintext secrets.

Key Features
- Password generator: length slider, numbers/symbols toggles, exclude look-alikes.
- Client-side encryption: AES-based encryption in the browser; server stores only ciphertext.
- Vault CRUD: Add, view, edit, delete entries (title, username, password, URL, notes).
- Search/filter: Basic search across saved entries.
- Copy-to-clipboard with auto-clear (approx. 10–20s).
- Simple auth: Email + password with bcrypt hashing and JWT (HTTP-only cookie).
- Optional 2FA (TOTP): Speakeasy + QR setup with qrcode.
- Dark mode: One-click theme toggle.
- Export/Import: Encrypted export and import of your vault.

Tech Stack
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Backend: Next.js API Routes
- Database: MongoDB + Mongoose
- Crypto: crypto-js (AES) for client-side encryption; Web Crypto API for secure random passwords
- 2FA: speakeasy (TOTP), qrcode

How client-side encryption works
- We use crypto-js AES to encrypt vault item fields in the browser.
- Your login password is used as the client-side key (kept only in sessionStorage on the client). The server and database never see decrypted data.
- Passwords are generated via the Web Crypto API (crypto.getRandomValues) for strong randomness.

Project Structure (high level)
- src/components: UI components (AuthForm, PasswordGenerator, VaultForm, VaultItem, ExportImport, DarkModeToggle)
- src/app/api: API routes for auth, vault, and 2FA
- src/lib: db connection, auth helpers (JWT/TOTP/QR), crypto helpers
- src/models: Mongoose models (User, VaultItem)

Environment Variables
Create a .env.local file in the project root with:
- MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
- JWT_SECRET=<a-strong-random-string>

Run locally
- Install dependencies
  - npm install
- Validate your environment
  - npm run validate:env
- Start the dev server
  - npm run dev
- Open http://localhost:3000

Database helpers
- Test DB connection: npm run test:db
- Seed demo data: npm run seed

2FA notes
- TOTP setup/verification is available via API routes and uses speakeasy.
- Ensure the user model field totpSecret is used consistently in all 2FA endpoints (setup/verify/disable/login). If you previously used a different field name, re-setup 2FA after deploying this version.

Security Notes
- The server stores only ciphertext; decryption occurs solely in the browser.
- HTTP-only cookie for JWT reduces XSS risk.
- Copy-to-clipboard auto-clears after a short delay.
- Do not log plaintext secrets. Avoid printing sensitive data to the console.

Assignment Coverage
- Must-haves: Password generator, auth, encrypted vault CRUD, copy with auto-clear, basic search – implemented.
- Nice-to-haves: 2FA, dark mode, export/import – implemented.

Troubleshooting
- 2FA codes rejected: check that your system/server time is accurate and that totpSecret is set for the account. If 2FA is enabled with no secret stored, log in and re-setup 2FA.
- Cannot connect to DB: verify MONGODB_URI and network access to MongoDB Atlas/local instance.
- Blank decryptions: ensure you’re logged in with the same password used to encrypt (the key lives in sessionStorage).

License
MIT

Credits
- Founder: https://in.linkedin.com/in/setu-agrawal-1032681aa
- Company: https://in.linkedin.com/company/web-development-company-top
