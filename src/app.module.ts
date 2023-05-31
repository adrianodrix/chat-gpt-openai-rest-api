import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGptAiModule } from './chat-gpt-ai/chat-gpt-ai.module';

@Module({
  imports: [ConfigModule.forRoot(), ChatGptAiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
