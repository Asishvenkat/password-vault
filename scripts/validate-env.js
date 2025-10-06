require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NEXT_PUBLIC_APP_URL'
];

console.log('🔍 Validating environment variables...\n');

let allValid = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  
  if (!value) {
    console.error(`❌ ${varName} is not set`);
    allValid = false;
  } else {
    console.log(`✅ ${varName} is set`);
    
    // Additional validation
    if (varName === 'MONGODB_URI') {
      if (!value.startsWith('mongodb://') && !value.startsWith('mongodb+srv://')) {
        console.error(`⚠️  ${varName} should start with 'mongodb://' or 'mongodb+srv://'`);
        allValid = false;
      }
    }
    
    if (varName === 'JWT_SECRET') {
      if (value.length < 32) {
        console.error(`⚠️  ${varName} should be at least 32 characters long for security`);
        allValid = false;
      }
    }
  }
});

console.log('\n' + (allValid ? '✅ All environment variables are valid!' : '❌ Some environment variables are missing or invalid'));

if (!allValid) {
  console.log('\n📝 Create a .env.local file with:');
  console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/passwordvault');
  console.log('JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars');
  console.log('NEXT_PUBLIC_APP_URL=http://localhost:3000');
  process.exit(1);
}
