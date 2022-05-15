import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import configuration from './config';
import { UberHelper } from './helpers/uber.helper';
import { DidiHelper } from './helpers/didi.helper';
import { CabifyHelper } from './helpers/cabify.helper';
import { BeatHelper } from './helpers/beat.helper';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, UberHelper, DidiHelper, CabifyHelper, BeatHelper],
})
export class AppModule {}
