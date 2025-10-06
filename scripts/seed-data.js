const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
require('dotenv').config({ path: '.env.local' });

async function seedData() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found');
    process.exit(1);
  }

  const client = await MongoClient.connect(uri);
  const db = client.db('passwordvault');

  console.log('🌱 Seeding sample data...\n');

  // Create test user
  const testEmail = 'demo@example.com';
  const testPassword = 'DemoPassword123!';
  
  // Check if user already exists
  const existingUser = await db.collection('users').findOne({ email: testEmail });
  
  if (existingUser) {
    console.log('⚠️  Demo user already exists. Skipping user creation.');
    await client.close();
    return;
  }

  const hashedPassword = await bcrypt.hash(testPassword, 12);
  
  const userResult = await db.collection('users').insertOne({
    email: testEmail,
    password: hashedPassword,
    createdAt: new Date()
  });

  console.log('✅ Created test user: demo@example.com');
  console.log('   Password: DemoPassword123!');

  // Encrypt passwords with test password
  const encryptPassword = (text) => {
    return CryptoJS.AES.encrypt(text, testPassword).toString();
  };

  // Create sample vault items
  const sampleItems = [
    {
      userId: userResult.insertedId.toString(),
      title: 'Gmail Account',
      username: 'demo@gmail.com',
      password: encryptPassword('SecureGmail123!'),
      url: 'https://mail.google.com',
      notes: 'Primary email account',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: userResult.insertedId.toString(),
      title: 'GitHub',
      username: 'demouser',
      password: encryptPassword('GitHub@Secure456'),
      url: 'https://github.com',
      notes: 'Development account for open source projects',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: userResult.insertedId.toString(),
      title: 'Netflix Subscription',
      username: 'demo@example.com',
      password: encryptPassword('NetflixPass789!'),
      url: 'https://netflix.com',
      notes: 'Premium family plan',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection('vaultItems').insertMany(sampleItems);
  console.log('✅ Created 3 sample vault items\n');

  await client.close();
  
  console.log('🎉 Seeding complete!\n');
  console.log('📝 Login credentials:');
  console.log('   Email: demo@example.com');
  console.log('   Password: DemoPassword123!');
  console.log('\n💡 You can now run: npm run dev');
}

seedData().catch(console.error);
