

const mongoose = require ('mongoose');
const express = require ('express');
require('dotenv').config();


const app = express;


mongoose.connect(process.env.MongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB successfully");
}).catch((error) => {
  console.log("Error connecting to MongoDB", error);
});
