import users from '../users.js';
import { checkPassword } from './encrypt.js';
import jwt from 'jsonwebtoken';
require('dotenv').config();

const secretKey = process.env.secretToken;

async function login(username, password) {
  console.log("");
  const user = await users.findOne({ username });
  if (!user) {
    return 'Invalid username';
  }

  if (!checkPassword(password, user.password)) {
    return 'Invalid password';
  }

  // Create the JWT payload
  const payload = {
    id: user._id,
    username: user.username
  };

  // Sign the JWT with the secret key
  const token = jwt.sign(payload, secretKey);

  return {
    user,
    token
  };
}

// Verify a JWT with the secret key
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    return null;
  }
}

export { login, verifyToken };
