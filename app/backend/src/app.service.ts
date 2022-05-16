import { HttpException, Injectable } from '@nestjs/common';
import { UberHelper } from './helpers/uber.helper';
import { CabifyHelper } from './helpers/cabify.helper';
import { DidiHelper } from './helpers/didi.helper';
import { BeatHelper } from './helpers/beat.helper';
import { Location } from './interfaces/location';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { maps } from './config/environment';

@Injectable()
export class AppService {
  constructor(
    private http: HttpService,
    private uberHelper: UberHelper,
    private cabiHelper: CabifyHelper,
    private didiHelper: DidiHelper,
    private beatHelper: BeatHelper
  ) { }

  public async getTripPrices(fromId: string, toId : string) {
    const from : Location = await this.geocode(fromId)
    const to : Location = await this.geocode(toId)
    return {
      uber: await this.uberHelper.getPrice(from, to),
      cabi: await this.cabiHelper.getPrice(from, to),
      didi: await this.didiHelper.getPrice(from, to),
      beat: await this.beatHelper.getPrice(from, to)
    }
  }

  public async autocomplete(query: string) {
    const { data } = await firstValueFrom(this.http.get(`${maps.requestUrl}/place/autocomplete/json?input=${query}&key=${process.env.MAPS_API_KEY}&radius=5000`))
    return data.predictions.map(pred => {
      return {
        id: pred.place_id,
        main_text: pred.structured_formatting.main_text,
        secondary_text: pred.structured_formatting.secondary_text
      }
    })
  }

  public async geocode(place_id:string) : Promise<Location> {
    const { data } = await firstValueFrom(this.http.get(`${maps.requestUrl}/geocode/json?place_id=${place_id}&key=${process.env.MAPS_API_KEY}`))
    console.log(data)
    return data.results[0].geometry.location
  }

}
