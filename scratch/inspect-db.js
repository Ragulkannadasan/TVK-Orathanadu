const mongoose = require('mongoose');

async function checkDB() {
  const MONGODB_URI = "mongodb+srv://ragulkavai_db_user:Ragul%40123@cluster0.jt8lve3.mongodb.net/tvk-orathanadu?retryWrites=true&w=majority&appName=Cluster0";
  
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
  
  const db = mongoose.connection.db;
  const usersCollection = db.collection('users');
  
  const user = await usersCollection.findOne({ email: "ragulkannadasan2@gmail.com" });
  console.log("Raw Database User Object:", JSON.stringify(user, null, 2));
  
  process.exit(0);
}

checkDB().catch(err => {
  console.error(err);
  process.exit(1);
});
