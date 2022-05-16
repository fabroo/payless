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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // https://login.uber.com/oauth/v2/authorize?client_id=nBpY4XCqgLXpN6wlGh_gUiQiV99ytA1T&response_type=code

  // @Get('/redirect_uri')
  // getHello(@Query('code') code: string): Promise<any> {
  // return this.appService.authorize(code);
  // }

  @Get('prices')
  public getTripPrices(@Body() locations: LocationGroup) {
    if (!locations.from || !locations.to)
      throw new BadRequestException('Body is incorrectly formatted.');
    return this.appService.getTripPrices(locations.from, locations.to);
  }
}
