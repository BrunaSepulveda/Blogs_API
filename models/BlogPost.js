module.exports = (sequelize, DataTypes) => {
  const BlogPostSchema = {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    published: DataTypes.DATE,
    updated: DataTypes.DATE,
  };

  const BlogPostModel = sequelize.define('BlogPost', BlogPostSchema, {
    timestamps: false,
    tableName: 'BlogPosts',
  });

  BlogPostModel.associate = (models) => {
    BlogPostModel.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });
  };

  return BlogPostModel;
};
