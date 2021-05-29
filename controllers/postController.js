const jwt = require('jsonwebtoken');
const {
  checkBodyCatergory,
  createPostAndPostCategory,
  getAllBlogPost,
  getBlogPostById,
  checkBodyToUpdate,
  updateBlogPost,
} = require('../service/postService');
const { checkTokenExists } = require('../service/userService');
const status = require('../utils/status');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
const messages = require('../utils/messages');

const noPost = {
  http: status.NOT_FOUND,
  message: {
    message: messages.NOT_POST,
  },
};

const createPost = async (request, response) => {
  try {
    const bodyCategory = request.body;
    const token = request.headers.authorization;
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

const getAll = async (request, response) => {
  try {
    const token = request.headers.authorization;
    const check = checkTokenExists(token);
    if (check) {
      return response.status(check.http).json(check.message);
    }
    jwt.verify(token, secret);
    const blogPosts = await getAllBlogPost();
    return response.status(status.OK).json(blogPosts);
  } catch (error) {
    console.log(error.message);
    return response.status(status.UNAUTHORIZED).json({ message: messages.EXPIRED });
  }
};

const getById = async (request, response) => {
  try {
    const token = request.headers.authorization;
    const check = checkTokenExists(token);
    if (check) {
      return response.status(check.http).json(check.message);
    }
    jwt.verify(token, secret);
    const { id } = request.params;
    const blogPost = await getBlogPostById(id);
    if (!blogPost) {
      return response.status(noPost.http).json(noPost.message);
    }
    return response.status(status.OK).json(blogPost);
  } catch (error) {
    console.log({ ERROUUU: error.message });
    return response.status(status.UNAUTHORIZED).json({ message: messages.EXPIRED });
  }
};

const putById = async (request, response) => { 
  try {
    const token = request.headers.authorization;
    const check = checkTokenExists(token);
    if (check) { return response.status(check.http).json(check.message); }
    const user = jwt.verify(token, secret);
    const { id } = request.params;
    const { body } = request;
    const checkBody = await checkBodyToUpdate(id, user, body);
    if (checkBody) { return response.status(checkBody.http).json(checkBody.message); }
    const blogPost = await updateBlogPost(id, body);
    return response.status(status.OK).json(blogPost);
  } catch (error) {
    console.log({ ERROUUU: error.message });
    return response.status(status.UNAUTHORIZED).json({ message: messages.EXPIRED });
  }
};

module.exports = {
  createPost,
  getAll,
  getById,
  putById,
};

/*
function rotLeft(a, d) {
    console.log(a,d)
    const newArray = [...a];
    const arrayrigth = [];
    newArray.forEach((element, index, array) => {
        if(index + d >= array.length) {
            const newIndex = (d + index) - array.length
            arrayrigth[newIndex] = element;
            return ;
        }
        arrayrigth[index + d] = element;
    })
    return arrayrigth;
}
*/