const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI not found in .env');
    process.exit(1);
}

mongoose.connect(MONGO_URI).then(async () => {
    console.log('✅ Connected to MongoDB');
    const result = await mongoose.connection.collection('users').deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} users`);
    // Also clear resumes and applications linked to those users
    const r2 = await mongoose.connection.collection('resumes').deleteMany({});
    const r3 = await mongoose.connection.collection('applications').deleteMany({});
    console.log(`🗑️  Deleted ${r2.deletedCount} resumes`);
    console.log(`🗑️  Deleted ${r3.deletedCount} applications`);
    mongoose.disconnect();
    console.log('✅ Done');
}).catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
