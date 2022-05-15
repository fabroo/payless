import { Injectable } from '@nestjs/common';
import { UberHelper } from './helpers/uber.helper';
import { CabifyHelper } from './helpers/cabify.helper';
import { DidiHelper } from './helpers/didi.helper';
import { BeatHelper } from './helpers/beat.helper';
import { Location } from './interfaces/location';

@Injectable()
export class AppService {
  constructor(
    private uberHelper : UberHelper,
    private cabiHelper : CabifyHelper,
    private didiHelper : DidiHelper,
    private beatHelper : BeatHelper
  ){}

  public async getTripPrices(from: Location, to: Location) {
      return {
        uber: await this.uberHelper.getPrice(from, to),
        cabi: await this.cabiHelper.getPrice(from, to),
        didi: await this.didiHelper.getPrice(from, to),
        beat: await this.beatHelper.getPrice(from, to)
      }
  }
}
