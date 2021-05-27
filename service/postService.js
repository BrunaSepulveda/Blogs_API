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

const getAllPostAndEachUser = async () => {
  const blogPosts = await BlogPost.findAll();
  const users = await User.findAll();
  const newObj = blogPosts.reduce((acc, post) => {
    const { userId } = post;
    const user = users.find((person) => person.id === userId);
    const informations = user.map((unique) => ({ 
      id: unique.id,
      displayName: unique.displayName,
      email: unique.email,
      image: unique.image,
    }));
    acc.push({ ...post, user: { ...informations[0] } });
    return acc;
  }, []);
  return newObj;
};

const PostAndEachCategoriesIds = async (postAndUser) => {
  const postsCategories = await PostsCategory.findAll();
  const posts = postAndUser.reduce((acc, post) => {
    const categories = postsCategories.filter((element) => element.postId === post.id);
    const onlyCategoriesId = categories.map((category) => ({ id: category.categoryId }));
    acc.push({ ...post, categories: onlyCategoriesId });
    return acc;
  }, []);
  return posts;
};

const PostAndEachCategoriesName = async (postAndCategoryId) => {
  const CategoriesName = await Category.findAll();
  const getReturn = postAndCategoryId.reduce((acc, curr) => {
    const idsCategoryList = curr.categories;
    const nameCategoryList = idsCategoryList.map((item) => CategoriesName
      .find((category) => category.id === item.id));
    acc.push({ ...postAndCategoryId, categories: nameCategoryList });
    return acc;
  }, []);
  return getReturn;
};

const getAllBlogPost = async () => {
  const postAndUserList = await getAllPostAndEachUser();
  console.log({ postAndUserList });
  const postAndCategoryId = await PostAndEachCategoriesIds(postAndUserList);
  console.log({ postAndCategoryId });
  const getAllReturn = await PostAndEachCategoriesName(postAndCategoryId);
  console.log({ getAllReturn });
  return getAllReturn;
};

module.exports = {
  checkBodyCatergory,
  createPostAndPostCategory,
  getAllBlogPost,
};
