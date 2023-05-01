
const users = require('../users.js');
const jwt = require('jsonwebtoken');

var secretKey = process.env.TOKEN_SECRET;

// Login takes two params username and password
async function login(userName, password) {
  console.log('userName:', userName);

  // Find the user with the given username
  const user = await users.findOne({ userName });
  console.log('user:', user);

  // Throw an error if no user is found with the given username
  if (!user) {
    throw new Error('Invalid username');
  }

  // Throw an error if the given password does not match the users password
  if (user.password !== password) {
    throw new Error('Incorrect password');
  }

  // Generate a JWT token using the user's ID and the secret key
  const token = jwt.sign({ userID: user.userID }, secretKey);
  console.log("tokenLogin: " , token);

  // Return the token and user if login is successful
  return { token, user };
}

module.exports = login;
