const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const RegisterNewUser = require('./authentication/Register');
const login = require('./authentication/LogIn');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const users = require('./users');
const middleware = require('./middleware');


var secretKey = process.env.TOKEN_SECRET;

// Connect to mongoDB 
mongoose.connect(process.env.MongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB successfully");
}).catch((error) => {
  console.log("Error connecting to MongoDB", error);
});

//view engine of views 
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Route to identify page
app.get('/identify', async (req, res) => {
  res.render("identify.ejs");
});

//Route to register page
app.get('/register', async (req, res) => {
  res.render("register.ejs");
});

//If user is verified, render start.ejs
app.get('/start', middleware.authenticateToken, async (req, res) => {
 
  const token = req.cookies.token;
  console.log("token", token);
  if (!token) {
    //If no token, redirect to identify.ejs
    res.status(401).json({ error: 'Unauthorized access' });
  }

  try {

    const decoded = jwt.verify(token, secretKey);
    console.log('Decoded token: ', decoded);
    const userID = decoded.userID;

    // Render the start.ejs view with the user ID
    res.render("start.ejs", { userID });
  } catch (err) {
    res.redirect('identify');
  }
});

//Route for admin
app.get('/admin', async (req, res) => {
  const token = req.cookies.token;

  //Check if the token exists, if not , render identify
  if (!token) {
    console.log('No token found');
    return res.render('identify.ejs');
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userID = decoded.userID;

    console.log('User ID:', userID);

    // Check if the user has an "admin" role
    const user = await users.findOne({ userID });
    console.log('User:', user);
    console.log(user.userRole);

    if (user && user.userRole === 'admin') {

      // User is an admin, render the admin page
      const data = await users.find({});
      res.render('admin.ejs', { userID, data });
    } else if(user && user.userRole !=='admin'){
      // User is not an admin, render identify
      return res.render('identify.ejs');
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(401).json({ error: 'Unauthorized access' });
  }
});

//Route for teacher
app.get('/teacher', async (req, res) => {
  const token = req.cookies.token;

  //check if token exists
  if (!token) {
    console.log('No token found');
    return res.render('identify.ejs');
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userID = decoded.userID;

    console.log('User ID:', userID);

    // Check if the user has an "teacher" role
    const user = await users.findOne({ userID });
    console.log('User:', user);
    console.log(user.userRole);

    if (user && user.userRole === 'teacher') {
      // User is an teacher, render the teacher page
      res.render('teacher.ejs');
    } else if(user && user.userRole !=='teacher'){
      // User is not an teacher, return 401
     
      return res.render('identify.ejs');
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(401).json({ error: 'Unauthorized access' });
  }
});

//Logout route to clear cookies.
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('identify');
});

//Handle post req. for register endpoint
app.post('/register', async (req, res) => {
  const { userID, userName, userRole, password } = req.body;
  await RegisterNewUser(userID, userName, userRole, password);
  res.redirect('identify');
});

//Handle post request for identify endpoint
app.post('/identify', async (req, res) => {
  const { userName, password } = req.body;

  try {
    // log the user in
    const result = await login(userName, password);

    // Generate a JWT token for the logged-in user
    const token = jwt.sign({ userID: result.user.userID }, secretKey);

    // Check if the user is an admin
    const user = await users.findOne({ userID: result.user.userID });
    if (user && user.userRole === 'admin') {
      // If the user is an admin, redirect to the admin page with the token as a cookie
      return res.cookie('token', token).redirect('/admin');
    } else if (user && user.userRole === 'teacher') {
      // If the user is a teacher, redirect to the teacher page with the token as a cookie
      return res.cookie('token', token).redirect('/teacher');
    } else {
      // If the user is not an admin or a teacher, redirect to the start page with the token as a cookie
      res.cookie('token', token);
      res.redirect('/start');
    }
  } catch (err) {
    // If the login fails, return an error message
    res.status(401).json({ error: 'Unauthorized access' });
  }
});

app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
