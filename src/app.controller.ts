import { Body, Controller, Get, Post } from '@nestjs/common';
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
    return await this.appService.sendMessage(data);
  }
}
