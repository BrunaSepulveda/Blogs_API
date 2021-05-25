const express = require('express');

const { verifyAll } = require('../service/userService');
const status = require('../service/status');
const { userToken } = require('../utils/auth');

const router = express.Router();
const { User } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { displayName, email, password, image } = req.body;
    const verify = await verifyAll(displayName, email, password);
    if (verify) {
      return res.status(verify.http).json(verify.message);
    }
    const newUser = await User.create({ displayName, email, password, image });
    const token = userToken(newUser);
    return res.status(status.CREATED).json({ token });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: 'Algo deu errado' });
  }
});

module.exports = router;
