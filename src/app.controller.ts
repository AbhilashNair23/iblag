import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SendMessageDto } from './model/send-message-dto.interface';

@Controller('v1/notification')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send')
  async sendMessage(@Body() data: SendMessageDto): Promise<any> {
    Logger.log('Request from triggering message!!');
    return await this.appService.sendMessage(data);
  }
}
