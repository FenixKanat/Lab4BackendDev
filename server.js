const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const RegisterNewUser = require('./authentication/Register');
const path = require('path');
const user = require('./users.js');
const setupAdminPath = require('./Routes/adminPath');
const setupRegisterPath= require('./Routes/registerPath');

mongoose.connect(process.env.MongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB successfully");
}).catch((error) => {
  console.log("Error connecting to MongoDB", error);
});

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

app.use(express.json());

setupAdminPath(app);
setupRegisterPath(app);

app.post('/register', async (req, res) => {
  const { userID, userName, userRole, password } = req.body;
  await RegisterNewUser(userID, userName, userRole, password);
  res.send('User has been registered successfully.');
});

app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
