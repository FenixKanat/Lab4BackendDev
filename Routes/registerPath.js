const express = require('express');
const router = express.Router();
const user = require('../users.js');

router.get('/', async (req, res) => {
  const allUsers = await user.find();
  res.render('register', { data: allUsers });
});

module.exports = (app) => {
  app.use('/register', router);
};
