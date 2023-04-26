const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  udr:{},
  userRole: { type: String, required: true },
  password: { type: String, required: true }
}, { collection: 'users' });

const User = mongoose.model("users", userSchema);



module.exports = User;
