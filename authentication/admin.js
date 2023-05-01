const users = require('../users.js');


async function admin(userN){
    const id = req.params.userName;

    try {
        const user = await users.findOne({ username: userN });
        if (!user) {
          return res.status(404).send('User not found');
        }
        res.send(user);
      } catch (err) {
        res.status(500).send(err);
      }
}