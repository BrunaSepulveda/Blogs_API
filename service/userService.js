const { User } = require('../models');
const status = require('./status');

const format = {
  minLenghtPass: 6,
  minLengthName: 8,
};

const returnVerifyName = {
  http: status.BAD_REQUEST,
  message: {
    message: '"displayName" length must be at least 8 characters long',
  },
};

const returnEmail = {
  notExists: {
    http: status.BAD_REQUEST,
    message: {
      message: '"email" is required',
    },
  },
  notFormat: {
    http: status.BAD_REQUEST,
    message: {
      message: '"email" must be a valid email',
    },
  },
  userRegistered: {
    http: status.CONFLICT,
    message: {
      message: 'User already registered',
    },
  },
};

const returnPassword = {
  notExists: {
    http: status.BAD_REQUEST,
    message: {
      message: '"password" is required',
    },
  },
  notFormat: {
    http: status.BAD_REQUEST,
    message: {
      message: '"password" length must be 6 characters long',
    },
  },
};

const verifyName = (displayName) => {
  if (!displayName || displayName.length < format.minLengthName) {
    return returnVerifyName;
  }
};

const verifyEmail = async (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return returnEmail.notExists;
  }
  if (regex.test(email)) {
    return returnEmail.notFormat;
  }
  const user = await User.findOne({ where: { email } });
  if (user) {
    return returnEmail.userRegistered;
  }
};

const verifyPass = (password) => {
  if (!password) {
    return returnPassword.notExists;
  }
  if (password.length < format.minLenghtPass) {
    return returnPassword.notFormat;
  }
};

const verifyAll = async (displayName, email, password) => {
  if (verifyName(displayName)) {
    return verifyName(displayName);
  }
  if (await verifyEmail(email)) {
    return verifyEmail(email);
  }
  if (verifyPass(password)) {
    return verifyPass(password);
  }
};

module.exports = {
  verifyAll,
};