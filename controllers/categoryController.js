const jwt = require('jsonwebtoken');
const { checkName } = require('../service/categoryService');
const { checkTokenExists } = require('../service/userService');
const status = require('../utils/status');

const secret = 'BLOG';
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
    return response.status(status.UNAUTHORIZED).json({ message: messages.EXPIRED });
  }
};

module.exports = {
  createCategory,
};