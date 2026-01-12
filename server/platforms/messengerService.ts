import axios from 'axios';

export class MessengerService {
  pageToken: string;

  constructor(pageToken: string) {
    this.pageToken = pageToken;
  }

  async sendMessage(psid: string, message: any) {
    return axios.post(
      `https://graph.facebook.com/v17.0/me/messages`,
      {
        recipient: { id: psid },
        message: message
      },
      { params: { access_token: this.pageToken } }
    );
  }
}
