const axios = require('axios');

class MessengerService {
  constructor(pageToken) {
    this.pageToken = pageToken;
  }

  /**
   * @param {string} psid
   * @param {*} message
   * @param {Object} [params={}]
   */
  async sendMessage(psid, message, params = {}) {
    return axios.post(
      'https://graph.facebook.com/v17.0/me/messages',
      {
        recipient: { id: psid },
        message: message
      },
      { params }
    );
  }
}

module.exports = MessengerService;
