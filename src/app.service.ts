import { HttpCode, HttpStatus, Injectable, Logger } from '@nestjs/common';
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
      }
    } catch (e) {
      response = {
        status: HttpStatus.EXPECTATION_FAILED,
        message: e.message,
      };
    }
    return response;
  }

  async triggerVoiceCall(request: SendMessageDto): Promise<any> {
    let response;
    try {
      const responseData = await this.client.calls.create({
        url: process.env.URL,
        to: request.toNumber,
        from: process.env.TWILIO_NUMBER
      });
      Logger.log('voice call triggered!!');
      response = {
        status: HttpStatus.OK,
        data: responseData,
      };
    } catch (e) {
      response = {
        status: HttpStatus.EXPECTATION_FAILED,
        message: e.message,
      };
    }
    return response;
  }

  async triggerSMS(request: SendMessageDto): Promise<any> {
    let response;
    try {
      const responseData = await this.client.messages.create({
        to: request.toNumber,
        messagingServiceSid: process.env.MESSAGING_SERVICE_SID,
        body: request.message,
      });
      Logger.log('sms triggered!!');
      response = {
        status: HttpStatus.OK,
        data: responseData,
      };
    } catch (e) {
      response = {
        status: HttpStatus.EXPECTATION_FAILED,
        message: e.message,
      };
    }
    return response;
  }

  async triggerWhatsappMessage(request: SendMessageDto): Promise<any> {
    let response;
    try {
      const responseData = await this.client.messages.create({
        to: 'whatsapp:' + request.toNumber,
        from: 'whatsapp:' + process.env.FROM_NUMBER,
        body: request.message,
      });
      Logger.log('Whatsapp message triggered!!');
      response = {
        status: HttpStatus.OK,
        data: responseData,
      };
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
