module.exports = (sequelize, DataTypes) => {
  const UserSchema = {
    displayName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
  };

const UsersModel = sequelize.define('User', UserSchema, { timestamps: false, tableName: 'Users' });

  UsersModel.associate = (models) => {
    UsersModel.hasMany(models.BlogPost, {
      as: 'blogPost',
      foreignKey: 'userId',
    });
  };

  return UsersModel;
};
