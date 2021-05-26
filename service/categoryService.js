const status = require('../utils/status');
const messages = require('../utils/messages');

const notName = {
  http: status.BAD_REQUEST,
  message: {
    message: messages.NAME_CATEGORY,
  },
};

const checkName = (information) => {
  if (!information.name) {
    return notName;
  }
};

module.exports = {
  checkName,
};