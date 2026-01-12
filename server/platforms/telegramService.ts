import TelegramBot from 'node-telegram-bot-api';

export class TelegramService {
  bot: TelegramBot;

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });
  }

  async sendMessage(chatId: string, text: string, options: any = {}) {
    return this.bot.sendMessage(chatId, text, {
      reply_markup: options.keyboard,
      parse_mode: 'HTML'
    });
  }
}
