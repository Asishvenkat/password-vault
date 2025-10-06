const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  console.log('🔄 Testing MongoDB connection...\n');
  
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('passwordvault');
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test write
    await db.collection('_test').insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Write test passed');
    
    // Test read
    const doc = await db.collection('_test').findOne({ test: true });
    console.log('✅ Read test passed');
    
    // Cleanup
    await db.collection('_test').deleteMany({});
    console.log('✅ Delete test passed');
    
    await client.close();
    console.log('\n🎉 All database tests passed!');
    console.log('✅ Your database is ready to use');
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    console.log('\n📝 Troubleshooting:');
    console.log('1. Check MONGODB_URI format in .env.local');
    console.log('2. Verify database user exists in MongoDB Atlas');
    console.log('3. Check network access (whitelist IP 0.0.0.0/0)');
    console.log('4. Ensure user has read/write permissions');
    process.exit(1);
  }
}

testConnection();
