import { HttpService } from '@nestjs/axios';
import { Location } from '../interfaces/location';
import { didi } from '../config/environment';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DidiHelper {
  constructor(private http: HttpService) {}
  public async getPrice(from: Location, to: Location): Promise<number> {
    try {
      const { data } = await firstValueFrom(
        this.http.post(didi.requestUrl, this.generateDidiBody(from, to))
      );
      return this.getPriceFromJSON(data);
    } catch (error) {
      throw error;
    }
  }

  public getPriceFromJSON(json: Record<string, any>) {
    const bookingFee = Number(
      json.data.abilities[
        'xEngine/passenger'
      ].data.passenger_eyeball_estimate.data.data.estimate_data[0].items[0].cars_info_detail[0].car_detail[0].info.fees[2].rich_value.text.replace(
        '$',
        ''
      ));
      
    const baseFare = Number(json.data.abilities['xEngine/passenger'].data.passenger_eyeball_estimate
    .data.data.estimate_data[0].items[0].car_info.price.rich.text.replace(/,/g, ''))

    return baseFare + bookingFee;
  }

  public generateDidiBody(from: Location, to: Location): any {
    return {
      abilities: {
        'xEngine/passenger': {
          biz_param: {
            passenger_eyeball_estimate: {
              from_lng: from.lng,
              from_lat: from.lat,
              to_lng: to.lng,
              to_lat: to.lat,
              carpool_seat_num: '1'
            }
          },
          scene: 'xEngine_estimate'
        }
      },
      common: {
        app_version: '7.2.84',
        location_country: 'AR',
        terminal_id: 7,
        ticket: process.env.DIDI_TICKET,
        city_id: 54052300
      }
    };
  }
}
