
const jwt = require('jsonwebtoken');
const users = require('./users');

var secretKey = process.env.TOKEN_SECRET;

// Middleware function to authenticate the token
const authenticateToken = async (req, res, next) => {
  try {
    // extract the token
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
      // If the token doesnt exist, redirect to the identify.ejs
      return res.redirect('/identify');
    }

    // Verify the token and get the userID from it
    const decoded = jwt.verify(token, secretKey);
    const userID = decoded.userID;

    // Check if the userID exists in the database
    const user = await users.findOne({ userID });
    if (!user) {
      // If user ID is not found, redirect to the identify page
      return res.redirect('/identify');
    }

    // assign the userID in the request, and call the next
    req.userID = userID;
    next();
  } catch (err) {
    // If there is an error (meaning wrong username or pass), return a 401 Unauthorized error
    console.error('Error:', err);
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

// Export the middleware function
module.exports = { authenticateToken };
