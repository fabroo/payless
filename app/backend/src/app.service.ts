import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { UberHelper } from './helpers/uber.helper';
import { CabifyHelper } from './helpers/cabify.helper';
import { DidiHelper } from './helpers/didi.helper';
import { BeatHelper } from './helpers/beat.helper';
import { Location } from './interfaces/location';

@Injectable()
export class AppService {
  constructor(
    private http: HttpService,
    private uberHelper : UberHelper,
    private cabifyHelper : CabifyHelper,
    private didiHelper : DidiHelper,
    private beatHelper : BeatHelper
  ){}
  
  public async getTripPrices(from: Location, to: Location) {

  }
}
