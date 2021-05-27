const jwt = require('jsonwebtoken');
const { verifyAll, checkTokenExists, checkById } = require('../service/userService');
const status = require('../utils/status');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
const { userToken } = require('../utils/auth');

const { User } = require('../models');
const messages = require('../utils/messages');

const user = async (request, response) => {
  try {
    const information = { ...request.body };
    const verify = await verifyAll(information);
    if (verify) {
      return response.status(verify.http).json(verify.message);
    }
    const newUser = await User.create({ ...information });
    const token = userToken(newUser);
    return response.status(status.CREATED).json({ token });
  } catch (error) {
    return response.status(status.INT_SERVER_ERROR).json({ message: error.message });
  }
};

const getAll = async (request, response) => {
  try {
    const token = request.headers.authorization;
    const check = checkTokenExists(token);
    if (check) {
      return response.status(check.http).json(check.message);
    }
    jwt.verify(token, secret);
    const allUsers = await User.findAll();
    return response.status(status.OK).json(allUsers);
  } catch (error) {
    return response.status(status.UNAUTHORIZED).json({ message: messages.EXPIRED });
  }
};

const getById = async (request, response) => {
  try {
    const { id } = request.params;
    const token = request.headers.authorization;
    const check = checkTokenExists(token);
    if (check) {
      return response.status(check.http).json(check.message);
    }
    jwt.verify(token, secret);
    const checkId = await checkById(id);
    if (checkId) {
      return response.status(checkId.http).json(checkId.message);
    }
    const userById = await User.findByPk(id);
    return response.status(status.OK).json(userById);
  } catch (error) {
    return response.status(status.UNAUTHORIZED).json({ message: messages.EXPIRED });
  }
};

module.exports = {
  user,
  getAll,
  getById,
};
