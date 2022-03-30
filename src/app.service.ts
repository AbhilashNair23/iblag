import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { channel } from './model/common.enum';
import { SendMessageDto } from './model/send-message-dto.interface';

@Injectable()
export class AppService {
  public constructor(@InjectTwilio() private readonly client: TwilioClient) { }

  async sendMessage(data: SendMessageDto): Promise<any> {
    let response;
    try {
      switch (data.channel) {
        case channel.whatsapp:
          response = await this.triggerWhatsappMessage(data);
          break;

        case channel.sms:
          response = await this.triggerSMS(data);
          break;

        case channel.voiceCall:
          response = await this.triggerVoiceCall(data);
          break;

        default:
          response = await this.triggerWhatsappMessage(data);
          break;
      }
    } catch (e) {
      response = {
        status: HttpStatus.EXPECTATION_FAILED,
        message: e.message,
      };
    }
    return response;
  }

  async triggerVoiceCall(data: SendMessageDto): Promise<any> {
    let response;
    try {
      response = await this.client.calls.create({
        url: process.env.URL,
        to: data.toNumber,
        from: process.env.TWILIO_NUMBER
      });
    } catch (e) {
      response = {
        status: HttpStatus.EXPECTATION_FAILED,
        message: e.message,
      };
    }
    return response;
  }

  async triggerSMS(data: SendMessageDto): Promise<any> {
    let response;
    try {
      response = await this.client.messages.create({
        to: data.toNumber,
        messagingServiceSid: process.env.MESSAGING_SERVICE_SID,
        body: data.message,
      });
    } catch (e) {
      response = {
        status: HttpStatus.EXPECTATION_FAILED,
        message: e.message,
      };
    }
    return response;
  }

  async triggerWhatsappMessage(data: SendMessageDto): Promise<any> {
    let response;
    try {
      response = await this.client.messages.create({
        to: 'whatsapp:' + data.toNumber,
        from: 'whatsapp:' + process.env.FROM_NUMBER,
        body: data.message,
      });
    } catch (e) {
      response = {
        status: HttpStatus.EXPECTATION_FAILED,
        message: e.message,
      };
    }
    return response;
  }


  getHello(): string {
    return 'Hello World!';
  }
}
