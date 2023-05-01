const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true},
  userName: { type: String, required: true },
  udr:{},
  userRole: { type: String, required: true },
  password: { type: String, required: true }
}, { collection: 'Users' });

const users = mongoose.model("Users", userSchema);
module.exports = users;
