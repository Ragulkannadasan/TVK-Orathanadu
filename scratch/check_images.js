const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const UserSchema = new mongoose.Schema({ email: String, image: String }, { strict: false });
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const users = await User.find({ image: { $exists: true, $ne: null } });
    console.log('Users with images:', users.length);
    users.forEach(u => {
      console.log(`Email: ${u.email}, Image Length: ${u.image?.length || 0}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();
