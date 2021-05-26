const status = require('../utils/status');
const { userToken } = require('../utils/auth');
const { checkForLogin } = require('../service/userService');

const { User } = require('../models');

const onLogin = async (request, response) => {
  try {
    const information = { ...request.body };
    const verify = await checkForLogin(information);
    if (verify) {
      return response.status(verify.http).json(verify.message);
    }
    const user = await User.findOne({ where: { email: information.email } });
    const token = userToken(user);
    return response.status(status.OK).json({ token });
  } catch (error) {
    return response.status(status.BAD_REQUEST)
      .json({ message: error.message });
  }
};

module.exports = { onLogin };