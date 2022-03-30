import { Injectable } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';

@Injectable()
export class AppService {
  public constructor(@InjectTwilio() private readonly client: TwilioClient) { }

  async sendWhatsappMessage(data: any): Promise<any> {
    const response = await this.client.messages.create({
      from: 'whatsapp:' + process.env.fromNumber,
      to: 'whatsapp:' + data.toNumber,
      body: data.message
    });
    return response;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
