const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const RegisterNewUser = require('./authentication/Register');
const login = require('./authentication/LogIn');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const users = require('./users.js');


// yesterday I added verify into /identify, check if it works or not.
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
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));




app.get('/start', async (req, res) => {
  // Verify the token
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('identify');
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userID = decoded.userID;

    // Render the start.ejs view with the user ID
    res.render("start.ejs", { userID });
  } catch (err) {
    res.redirect('identify');
  }
});


app.get('/identify', async (req, res) => {
  res.render("identify.ejs");
});

app.get('/register', async (req, res) => {
  res.render("register.ejs");
});

app.get('/admin', async (req, res) => {
  res.render("admin.ejs");
});

app.post('/register', async (req, res) => {
  const { userID, userName, userRole, password } = req.body;
  await RegisterNewUser(userID, userName, userRole, password);
  res.redirect('identify');
});

app.post('/identify', async (req, res) => {
  const { userName, password } = req.body;

  try {
    const result = await login(userName, password);

    // Pass the token to the client-side
    res.cookie('token', result.token);

    res.redirect('start');
  } catch (err) {
    res.render('identify.ejs', { error: err.message });
  }
});


app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
