import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
    }),
    TwilioModule.forRoot({
      accountSid: process.env.accountSid,
      authToken: process.env.authToken,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
