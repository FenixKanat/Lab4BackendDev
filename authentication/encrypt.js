import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();



var secretKey= process.env.secretToken;


async function encryptP(pass) {

  let encryption = await bcrypt.hash(pass, 10);
  console.log("encrypted: ", encryption);

  return encryption;

}

async function checkPassword(input, stored) {

  if (await bcrypt.compare(input, stored)) {
    console.log("success", input, stored);
    return true;
  }
  else {
    console.log("fail: ", input, stored);
    return false;
  }

}

export { encryptP, checkPassword };