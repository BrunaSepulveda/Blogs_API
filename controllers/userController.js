const jwt = require('jsonwebtoken');
const { verifyAll, checkTokenExists } = require('../service/userService');
const status = require('../utils/status');

const secret = 'BLOG';
const { userToken } = require('../utils/auth');

const { User } = require('../models');
const messages = require('../utils/messages');

const user = async (req, res) => {
  try {
    const information = { ...req.body };
    const verify = await verifyAll(information);

    if (verify) {
      return res.status(verify.http).json(verify.message);
    }
    const newUser = await User.create({ ...information });
    const token = userToken(newUser);
    return res.status(status.CREATED).json({ token });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: 'Algo deu errado' });
  }
};

const getAll = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const check = checkTokenExists(token);
    if (check) {
      return res.status(check.http).json(check.message);
    } 
    jwt.verify(token, secret);
    const allUsers = await User.findAll();
    return res.status(status.OK).json(allUsers);
  } catch (error) {
    return res.status(status.UNAUTHORIZED).json({ message: messages.EXPIRED });
  }
};

module.exports = { 
  user,
  getAll,
 };
