require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User').default;

async function run(email) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not defined in environment');
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: 'passwordvault' });
  const user = await User.findOne({ email }).lean();
  if (!user) {
    console.error('User not found');
    process.exit(2);
  }

  console.log('email:', user.email);
  console.log('is2FAEnabled:', !!user.is2FAEnabled);
  console.log('totpSecret (base32):', user.totpSecret || '<not set>');

  await mongoose.disconnect();
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/check-2fa.js <email>');
  process.exit(1);
}

run(email).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
