const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const userToken = (user) => {
  const { id, name, email } = user;
  const jwtConfig = {
    expiresIn: 60 * 5 * 10,
    algorithm: 'HS256',
  };

  const token = jwt.sign({ id, name, email }, secret, jwtConfig);
  return token;
};

module.exports = {
  userToken,
};