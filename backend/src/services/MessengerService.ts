```javascript
import axios from 'axios';

export default class MessengerService {
  // ...existing code...

  async sendMessage(psid: string, message: any, params: Record<string, any> = {}) {
    return axios.post(
      'https://graph.facebook.com/v17.0/me/messages',
      {
        recipient: { id: psid },
        message: message
      },
      { params }
    );
  }

  // ...existing code...
}
```