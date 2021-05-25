const jwt = require('jsonwebtoken');

const secret = 'BLOG';

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