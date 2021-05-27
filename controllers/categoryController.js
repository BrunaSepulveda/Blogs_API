const jwt = require('jsonwebtoken');
const { checkName } = require('../service/categoryService');
const { checkTokenExists } = require('../service/userService');
const status = require('../utils/status');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
const messages = require('../utils/messages');

const { Category } = require('../models');

const createCategory = async (request, response) => {
  try {
    const token = request.headers.authorization;
    const information = request.body;
    const check = checkTokenExists(token);
    if (check) {
      return response.status(check.http).json(check.message);
    }
    jwt.verify(token, secret);
    const name = checkName(information);
    if (name) {
      return response.status(name.http).json(name.message);
    }
    const newCategory = await Category.create({ ...information });
    return response.status(status.CREATED).json(newCategory);
  } catch (error) {
    console.log(error.message);
    return response.status(status.UNAUTHORIZED).json({ message: messages.EXPIRED });
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
    const allCategories = await Category.findAll();
    return response.status(status.OK).json(allCategories);
  } catch (error) {
    console.log(error.message);
    return response.status(status.UNAUTHORIZED).json({ message: messages.EXPIRED });
  }
};

module.exports = {
  createCategory,
  getAll,
};