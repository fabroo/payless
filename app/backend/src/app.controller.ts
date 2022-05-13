import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // https://login.uber.com/oauth/v2/authorize?client_id=nBpY4XCqgLXpN6wlGh_gUiQiV99ytA1T&response_type=code

  @Get('/redirect_uri')
  getHello(@Query('code') code: string): Promise<any> {
    return this.appService.authorize(code);
  }
}
