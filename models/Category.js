module.exports = (sequelize, DataTypes) => {
  const CategoriesSchema = {
    name: DataTypes.STRING,
  };

  const CategoriesModel = sequelize.define('Category', CategoriesSchema, { 
  timestamps: false,
  tableName: 'Categories',
});

return CategoriesModel;
};