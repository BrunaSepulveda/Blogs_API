module.exports = (sequelize, _DataTypes) => {
  const PostsCategoriesModel = sequelize.define('PostsCategory', {}, {
    timestamps: false, tableName: 'PostsCategories' });
  PostsCategoriesModel.associate = (models) => {
    models.Category.belongsToMany(models.Category, {
      as: 'category',
      through: PostsCategoriesModel,
      foreignKey: 'categoryId',
      otherKey: 'postId',
    });
    models.BlogPost.belongsToMany(models.BlogPost, {
      as: 'post',
      through: PostsCategoriesModel,
      foreignKey: 'postId',
      otherKey: 'categoryId',
    });
  };
  return PostsCategoriesModel;
};
