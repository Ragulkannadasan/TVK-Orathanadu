const mongoose = require('mongoose');

async function cleanDatabase() {
  const MONGODB_URI = "mongodb+srv://ragulkavai_db_user:Ragul%40123@cluster0.jt8lve3.mongodb.net/tvk-orathanadu?retryWrites=true&w=majority&appName=Cluster0";
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");
    
    const db = mongoose.connection.db;
    
    // Delete all users
    const userResult = await db.collection('users').deleteMany({});
    console.log(`Deleted ${userResult.deletedCount} users.`);
    
    // Delete all grievances
    const grievanceResult = await db.collection('grievances').deleteMany({});
    console.log(`Deleted ${grievanceResult.deletedCount} grievances.`);
    
    console.log("Database cleanup complete!");
    process.exit(0);
  } catch (err) {
    console.error("Cleanup failed:", err);
    process.exit(1);
  }
}

cleanDatabase();
