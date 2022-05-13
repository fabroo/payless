import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private http: HttpService){}
  async authorize(code: string): Promise<any> {
    console.log(code)

    console.log(`
    curl -F 'client_secret=${process.env.UBER_CLIENT_SECRET}' \
    -F 'client_id=${process.env.UBER_CLIENT_ID}' \
    -F 'grant_type=authorization_code' \
    -F 'redirect_uri=http://localhost:4500/redirect_uri' \
    -F 'scope=profile' \
    -F 'code=${code}' \
    https://login.uber.com/oauth/v2/token

 `)


    // return await this.http.get('https://api.uber.com/v1.2/estimates/price').pipe(map(response => response.data))
    return await this.http.post('https://login.uber.com/oauth/v2/token', {
      client_id: process.env.UBER_CLIENT_ID,
      client_secret: process.env.UBER_SECRET_ID,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:4500/redirect_uri',
      code: code,
      scope: 'profile'
    }).pipe(map(response => response.data))
  }
}
