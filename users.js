const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: String,
  userName: String,
  userRole: String,
  password: String,
}, { collection: 'users' })
 
const users = mongoose.model("users", userSchema);

module.exports = users;
