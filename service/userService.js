const { User } = require('../models');
const status = require('../utils/status');
const messages = require('../utils/messages');

const format = {
  minLenghtPass: 6,
  minLengthName: 8,
  minLengthFields: 1,
};
const invalidFields = {
  http: status.BAD_REQUEST,
  message: {
    message: messages.NO_FIELDS,
  },
};
const noToken = {
  http: status.UNAUTHORIZED,
  message: {
    message: messages.NO_TOKEN,
  },
};

const returnVerifyName = {
  http: status.BAD_REQUEST,
  message: {
    message: messages.NAME_LENGTH,
  },
};

const returnEmail = {
  notExists: {
    http: status.BAD_REQUEST,
    message: {
      message: messages.EMAIL_REQ,
    },
  },
  notFormat: {
    http: status.BAD_REQUEST,
    message: {
      message: messages.INVALID_EMAIL,
    },
  },
  userRegistered: {
    http: status.CONFLICT,
    message: {
      message: messages.ALREADY_USER,
    },
  },
  notLength: {
    http: status.BAD_REQUEST,
    message: {
      message: messages.NOT_ALLOW_EMAIL,
    },
  },
};

const returnPassword = {
  notExists: {
    http: status.BAD_REQUEST,
    message: {
      message: messages.PASS_REQ,
    },
  },
  notFormat: {
    http: status.BAD_REQUEST,
    message: {
      message: messages.PASS_LENGTH,
    },
  },
  notLength: {
    http: status.BAD_REQUEST,
    message: {
      message: messages.NOT_ALLOW_PASS,
    },
  },
};

const notIdUser = {
  http: status.NOT_FOUND,
  message: {
    message: messages.NOT_USER,
  },
};

const verifyName = (displayName) => {
  if (!displayName || displayName.length < format.minLengthName) {
    return returnVerifyName;
  }
  return false;
};

const verifyEmail = async (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return returnEmail.notExists;
  }
  if (!regex.test(email)) {
    return returnEmail.notFormat;
  }
  const user = await User.findOne({ where: { email } });
  if (user) {
    return returnEmail.userRegistered;
  }
  return false;
};

const verifyPass = (password) => {
  if (!password) {
    return returnPassword.notExists;
  }
  if (password.length < format.minLenghtPass) {
    return returnPassword.notFormat;
  }
  return false;
};

const verifyAll = async (information) => {
  if (verifyName(information.displayName)) {
    return verifyName(information.displayName);
  }
  if (verifyPass(information.password)) {
    return verifyPass(information.password);
  }
  const email = await verifyEmail(information.email);
  if (email) {
    return verifyEmail(information.email);
  }
  return false;
};
const verifyByEmail = (email, user) => {
  if (email === undefined) {
    return returnEmail.notExists;
  }
  if (email.length < format.minLengthFields) {
    return returnEmail.notLength;
  }
  if (!user) {
    return invalidFields;
  }
};

const verifyByPass = (password, user) => {
  if (password === undefined) {
    return returnPassword.notExists;
  }
  if (password.length < format.minLengthFields) {
    return returnPassword.notLength;
  }
  if (user.password !== password) {
    return invalidFields;
  }
};

const checkForLogin = async (information) => {
  let user;
  if (information.email) {
    user = await User.findOne({ where: { email: information.email } });
  }
  if (verifyByEmail(information.email, user)) {
    return verifyByEmail(information.email, user);
  }
  if (verifyByPass(information.password, user)) {
    return verifyByPass(information.password, user);
  }
  return false;
};

const checkTokenExists = (token) => {
  if (!token) {
    return noToken;
  }
  return false;
};

const checkById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    return notIdUser;
  }
};

module.exports = {
  verifyAll,
  checkForLogin,
  checkTokenExists,
  checkById,
  checkById,
};