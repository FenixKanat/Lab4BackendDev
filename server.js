const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const RegisterNewUser = require('./Register');

mongoose.connect(process.env.MongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB successfully");
}).catch((error) => {
  console.log("Error connecting to MongoDB", error);
});

app.use(express.json());

app.post('/register', async (req, res) => {
  const { userID, userName, userRole, password } = req.body;
  await RegisterNewUser(userID, userName, userRole, password);
  res.send('User has been registered successfully.');
});

app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
