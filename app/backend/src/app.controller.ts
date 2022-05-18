import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Query
} from '@nestjs/common';
import { AppService } from './app.service';
import { Location, LocationGroup } from './interfaces/location';
import { RequiredPipe } from './interfaces/required-pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // https://login.uber.com/oauth/v2/authorize?client_id=nBpY4XCqgLXpN6wlGh_gUiQiV99ytA1T&response_type=code

  // @Get('/redirect_uri')
  // getHello(@Query('code') code: string): Promise<any> {
  // return this.appService.authorize(code);
  // }

  @Get('prices')
  public getTripPrices(@Query('from', new RequiredPipe()) fromId: string, @Query('to', new RequiredPipe()) toId: string) {
    return this.appService.getTripPrices(fromId, toId);
  }

  @Get('/')
  public ping() {
    return 'buenass';
  }

  @Get('autocomplete')
  public autocomplete(@Query('query', new RequiredPipe()) query: string) {
    return this.appService.autocomplete(query);
  }
}
