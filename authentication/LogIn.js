import users from '../users.js';
import { checkPassword } from './encrypt.js';

async function login(username, password) {

  console.log("");

  const user = await users.findOne({ username });
  if (!user) {
    return 'Invalid username';
  }


  if (!checkPassword(password, user.password)) {
    return 'Invalid password';
  }
  

  return user;

}

export default login;