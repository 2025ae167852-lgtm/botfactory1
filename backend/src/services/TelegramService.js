const TelegramBot = require('node-telegram-bot-api');

class TelegramService {
  constructor(token) {
    this.bot = new TelegramBot(token, { polling: true });
  }

  async sendMessage(chatId, text, options = {}) {
    return this.bot.sendMessage(chatId, text, {
      reply_markup: options.keyboard,
      parse_mode: 'HTML'
    });
  }
}

module.exports = TelegramService;
