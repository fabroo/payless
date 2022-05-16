import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Location } from '../interfaces/location';
import { readFileSync } from 'fs';
import { beat } from '../config/environment';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BeatHelper {
  constructor(private http: HttpService) {}
  public async getPrice(from: Location, to: Location): Promise<number> {
    try {
      //   const token = JSON.parse(readFileSync('./src/config/keys.json', 'utf8'));
      const token = await this.refreshToken();
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
      throw new Error(error.response.statusText);
    }
  }

  public async refreshToken(): Promise<number> {
    try {
      const token = JSON.parse(readFileSync('./src/config/keys.json', 'utf8'));
      const { data } = await firstValueFrom(
        this.http.post(
          this.getBeatAuthLink(token.username, token.password, token.device_id),
          {},
          {
            headers: {
              authorization: `Basic: ${token.beatRefreshToken}`,
              accept: 'application/vnd.taxibeat.v3+json'
            }
          }
        )
      );
      return this.getAccessTokenFromData(data);
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  getBeatLink = (from: Location, to: Location) => {
    return `${beat.requestUrl}/${from.lat},${from.lng}/${to.lat},${to.lng}?id_pay_mean=cash`;
  };

  getBeatAuthLink = (username, password, device_id) => {
    return `https://hub.taxibeat.com/oauth2/token?region=ar&grant_type=password&username=${username}&password=${password}&device_id=${device_id}`;
  };

  public getPriceFromData(data: any): number {
    return data.services.find(service => service.label === 'Beat').fare_details
      .route.ride_fare_without_promo.amount;
  }

  public getAccessTokenFromData(data: any): number {
    return data.access_token;
  }
}
