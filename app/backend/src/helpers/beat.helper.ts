import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Location } from '../interfaces/location';
import { fstat, readFileSync, writeFileSync } from 'fs';
import { beat } from '../config/environment';
import { firstValueFrom } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class BeatHelper {
  constructor(private http: HttpService) {}
  public async getPrice(from: Location, to: Location): Promise<number> {
    try {
      const token = await this.refreshToken()
      const { data } = await firstValueFrom(
        this.http.get(this.getBeatLink(from, to), {
          headers: {
            authorization: `Bearer ${token}`,
            accept: 'application/vnd.taxibeat.v3+json'
          }
        })
      );
      return this.getPriceFromData(data);
    } catch (error) {
      if(error.response){
        throw new Error(error.response.statusText);
      }
      console.error(error)
      return 0
    }
    
  }

  public async refreshToken(): Promise<number> {
    try {
      const json = JSON.parse(readFileSync(beat.tokenFilePath, 'utf8'));
      if(!this.isExpired(json)) {
        return json.beatJwt.token;
      }
      const { data } = await firstValueFrom(
        this.http.post(
          this.getBeatAuthLink(process.env.BEAT_USERNAME, process.env.BEAT_PASSWORD, process.env.BEAT_DEVICE_ID),
          {},
          {
            headers: {
              authorization: `Basic: ${process.env.BEAT_REFRESH_TOKEN}`,
              accept: 'application/vnd.taxibeat.v3+json'
            }
          }
        )
      );
      json.beatJwt = {
        token: data.access_token,
        expiresIn: moment().add(data.expires_in, 'seconds').valueOf()
      }
      writeFileSync(beat.tokenFilePath, JSON.stringify(json, null, 4), 'utf8');
      return data.access_token;
    } catch (error) {
      throw new Error(error);
    }
  }

  public getBeatLink = (from: Location, to: Location) => {
    return `${beat.requestUrl}/${from.lat},${from.lng}/${to.lat},${to.lng}?id_pay_mean=cash`;
  };

  public getBeatAuthLink = (username, password, device_id) => {
    return `${beat.authUrl}?region=ar&grant_type=password&username=${username}&password=${password}&device_id=${device_id}`;
  };

  public getPriceFromData(data: any): number {
    return data.services.find(service => service.label === 'Beat').fare_details
      .route.ride_fare_without_promo.amount;
  }

  public isExpired(tokenData: {token:string, expiresIn:number}): boolean {
    return moment().isAfter(moment(tokenData.expiresIn));
  }
}
