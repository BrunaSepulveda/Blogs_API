module.exports = (sequelize, _DataTypes) => {
  const PostsCategoriesModel = sequelize.define('PostsCategory', {}, {
    timestamps: false, tableName: 'PostsCategories' });
  PostsCategoriesModel.associate = (models) => {
    models.Category.belongsToMany(models.BlogPost, {
      as: 'posts',
      through: PostsCategoriesModel,
      foreignKey: 'categoryId',
      otherKey: 'postId',
    });
    models.BlogPost.belongsToMany(models.Category, {
      as: 'categories',
      through: PostsCategoriesModel,
      foreignKey: 'postId',
      otherKey: 'categoryId',
    });
  };
  return PostsCategoriesModel;
};
