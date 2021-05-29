const { Category, BlogPost, PostsCategory, User } = require('../models');
const status = require('../utils/status');
const messages = require('../utils/messages');

const noTitle = {
  http: status.BAD_REQUEST,
  message: {
    message: messages.NOT_TITLE,
  },
};
const noContent = {
  http: status.BAD_REQUEST,
  message: {
    message: messages.NOT_CONTENT,
  },
};

const NotAllowBodyToUpdate = {
  notAllowCategory: {
    http: status.BAD_REQUEST,
    message: {
      message: messages.NOT_ALLOW_CATEGORY,
    },
  },
  notSameUser: {
    http: status.BAD_REQUEST,
    message: {
      message: messages.NOT_SAME_USER,
    },
  },
};

const returnCategory = {
  noCategory: {
    http: status.BAD_REQUEST,
    message: {
      message: messages.NOT_CATEGORY,
    },
  },
  noFoundCategory: {
    http: status.BAD_REQUEST,
    message: {
      message: messages.NOT_ID_CATEGORY,
    },
  },
};

const checkTitle = (body) => {
  if (!body.title) {
    return noTitle;
  }
  return false;
};

const checkContent = (body) => {
  if (!body.content) {
    return noContent;
  }
  return false;
};

const checkCategories = async (body) => {
  const categoryId = body.categoryIds;
  if (!categoryId) {
    return returnCategory.noCategory;
  }
  const allCategories = await Category.findAll();
  const haveAllIds = categoryId.every((id) => allCategories.some((category) => category.id === id));
  if (!haveAllIds) {
    return returnCategory.noFoundCategory;
  }
  return false;
};

const checkBodyCatergory = async (body) => {
  if (checkTitle(body)) {
    return checkTitle(body);
  }
  if (checkContent(body)) {
    return checkContent(body);
  }
  if (await checkCategories(body)) {
    return checkCategories(body);
  }
  return false;
};

const createInBlogPost = async (user, title, content) => {
  const newPost = await BlogPost.create({
    title,
    content,
    userId: user.id,
    published: new Date(),
    updated: new Date(),
  });
  return newPost;
};

const createPostCategories = async (blogPost, categoryIds) => {
  const { id } = blogPost;
  Promise.all(categoryIds.map(async (categoryId) => PostsCategory.create({
    categoryId,
    postId: id,
  })));
};

const createPostAndPostCategory = async (user, bodyCategory) => {
  const { title, content, categoryIds } = bodyCategory;
  const blogPost = await createInBlogPost(user, title, content);
  await createPostCategories(blogPost, categoryIds);
  return blogPost;
};

const categoryThereIs = (body) => {
  const { categoryIds } = body;
  if (categoryIds) {
    return NotAllowBodyToUpdate.notAllowCategory;
  } return false;
};

const checkSameUser = async (id, user) => {
  const post = await BlogPost.findByPk(id);
  if (user.id !== post.userId) {
    return NotAllowBodyToUpdate.notSameUser;
  } return false;
};

const checkBodyToUpdate = async (id, user, body) => {
  if (categoryThereIs(body)) {
    return categoryThereIs(body);
  }
  if (checkTitle(body)) {
    return checkTitle(body);
  }
  if (checkContent(body)) {
    return checkContent(body);
  }
  if (await checkSameUser(id, user)) {
    return checkSameUser(id, user);
  }
  return false;
};

const updateBlogPost = async (id, body) => {
  const { title, content } = body;
  return BlogPost.update(
    { title, content, updated: new Date() },
    { where: { id } },
  );
};

const getAllBlogPost = async () => {
  const posts = await BlogPost.findAll({
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });
  return posts;
};

const getBlogPostById = async (id) => BlogPost.findOne({
  where: { id },
  include: [
    { model: User, as: 'user', attributes: { exclude: ['password'] } },
    { model: Category, as: 'categories', through: { attributes: [] } },
  ],
});

module.exports = {
  checkBodyCatergory,
  createPostAndPostCategory,
  getAllBlogPost,
  getBlogPostById,
  checkBodyToUpdate,
  updateBlogPost,
};
