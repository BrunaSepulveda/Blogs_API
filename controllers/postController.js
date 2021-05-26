const jwt = require('jsonwebtoken');
const { checkBodyCatergory, createPostAndPostCategory } = require('../service/postService');
const { checkTokenExists } = require('../service/userService');
const status = require('../utils/status');
require('dotenv').config();

const secret = process.env.SECRET;
const messages = require('../utils/messages');

const createPost = async (request, response) => {
  try {
    const token = request.headers.authorization;
    const bodyCategory = request.body;
    const check = checkTokenExists(token);
    if (check) {
      return response.status(check.http).json(check.message);
    }
    const user = jwt.verify(token, secret);
    const checkBody = await checkBodyCatergory(bodyCategory);
    if (checkBody) {
      return response.status(checkBody.http).json(checkBody.message);
    }
    const newPost = await createPostAndPostCategory(user, bodyCategory);
    return response.status(status.CREATED).json(newPost);
  } catch (error) {
    return response.status(status.UNAUTHORIZED).json({ message: messages.EXPIRED });
  }
};

module.exports = {
  createPost,
};
