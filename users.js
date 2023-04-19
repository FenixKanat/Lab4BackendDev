import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userID: String,
  userName: String,
  userRole: String,
  password: String,
}, { collection: 'users' })
 
const users = mongoose.model("users", userSchema);

export default users;