const users = require('../users.js');
const jwt = require('jsonwebtoken');


async function login(userName, password) {
  console.log('userName:', userName);
  const user = await users.findOne({ userName });
  console.log('user:', user);

  if (!user) {
    throw new Error('Invalid username');
  }

  if (user.password !== password) {
    throw new Error('Incorrect password');
  }


  // Generate a token
  const token = jwt.sign({ userID: user.userID }, process.env.TOKEN_SECRET);

  // Return the token and user object if login is successful
  return { token, user };
}



module.exports = login;
