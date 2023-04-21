const express = require('express');
const router = express.Router();
const user = require('../users.js');
const path = require('path');

router.get('/', async (req, res) => {
  const allUsers = await user.find();
  res.render('login', { data: allUsers });
});

module.exports = (app) => {
  app.use('/login', router);
};
