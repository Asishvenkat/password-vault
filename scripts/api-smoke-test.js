const fetch = require('node-fetch');

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function signup(email, password) {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res;
}

async function login(email, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res;
}

async function run() {
  const email = `test+${Date.now()}@example.com`;
  const password = 'password123';

  console.log('Signing up', email);
  let res = await signup(email, password);
  console.log('Signup status', res.status);
  if (res.status >= 400) {
    console.error(await res.text());
  }

  console.log('Logging in');
  res = await login(email, password);
  console.log('Login status', res.status);
  if (res.status >= 400) {
    console.error(await res.text());
  }

  console.log('Done');
}

run().catch(err => {
  console.error('Smoke test error', err);
  process.exit(1);
});
