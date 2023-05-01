const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: { type: String, required: true},
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  password: { type: String, required: true }
}, { collection: 'Users' });

const users = mongoose.model("Users", userSchema);
module.exports = users;
