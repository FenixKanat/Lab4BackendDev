const users = require('../users');

async function RegisterNewUser(userID, userName, userRole, password) {
  const newUser = new users({
    userID,
    userName,
    userRole,
    password,
  });
  try {
    const registeredUser = await newUser.save();
    console.log("New user has been saved to the database: ", registeredUser);
  } catch (err) {
    console.log("Couldn't register user: ", err);
  }
}

module.exports = RegisterNewUser;
