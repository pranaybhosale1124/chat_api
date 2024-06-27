var express = require('express');
var router = express.Router();
const { verifyToken, authorizeUser } = require('../auth');
const sequelize = require('../models/db-config')
var initModels = require("../models/init-models");
var models = initModels(sequelize);

async function getAllUsers() {
  try {
    return await sequelize.transaction(async t => {
      const users = await models.user.findAll({ transaction: t });
      console.log(users);
      return users;
    })
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function getUserById(user_id) {
  try {
    return await sequelize.transaction(async t => {
      const users = await models.user.findOne({ where: { user_id } }, { transaction: t });
      console.log(users);
      return users;
    })
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

router.get('/get-all-users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get('/get-user/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

router.post('/login', async (req, res) => {
  const { username } = req.body;
  try {
    const user = await models.user.findOne({ where: { user_name: username } });
    if (user) {
      res.status(200).json({ message: 'Login successful', 'user': user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error logging in', error });
  }
});

router.get('/login-by-google', verifyToken, authorizeUser, async (req, res) => {
  console.log(req.user);
  res.json({ message: 'This is a protected route', user: req.user });
});

router.put('/update-user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { first_name, last_name, profile_picture, contact_number, email_id, information, active_status } = req.body;

  try {
    const user = await models.user.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.profile_picture = profile_picture || user.profile_picture;
    user.contact_number = contact_number || user.contact_number;
    user.email_id = email_id || user.email_id;
    user.information = information || user.information;
    user.active_status = active_status !== undefined ? active_status : user.active_status;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;