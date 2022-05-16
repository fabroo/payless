import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { readFileSync, writeFileSync } from "fs";
import * as moment from "moment";
import { firstValueFrom } from "rxjs";
import { cabify } from "src/config/environment";
import { asArray, Location } from "../interfaces/location";

@Injectable()
export class CabifyHelper {
    constructor(private http: HttpService){}
    public async getPrice(from: Location, to : Location) : Promise<number> {
        try {
            const token = await this.getAccessToken()
            //TODO: check if token is expired
            const {data} = await firstValueFrom(this.http.post(cabify.requestUrl, this.getQuery(from, to), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }))
            return data.data.estimates[0].total.amount/100
        } catch (error) {
            console.error( error)
            return 0;
        }
    }

    public getQuery(from : Location, to: Location) : any {
        return {"query":"query estimates ($estimateInput: EstimatesInput) {\nestimates(estimateInput: $estimateInput) {\ndistance\nduration\neta {\nformatted\nlowAvailability\nmax\nmin\n}\npriceBase{\namount\ncurrency\n}\nproduct {\ndescription {\nen\nes\npt\n}\nicon\nid\nname {\nca\nen\nes\npt\n}\n}\nroute\nsupplements{\ndescription\nkind\nname\npayToDriver\nprice {\namount\ncurrency\ncurrencySymbol\nformatted\n}\ntaxCode\n}\ntotal {\namount\ncurrency\n}\n}\n}",
        "variables":{
            "estimateInput":
            {
                "requesterId":"53532ef47bb8fc36df12d8d73e253910",
                "startType":"ASAP",
                "startAt":"",
                "stops":[{"loc":asArray(from)},{"loc":asArray(to)}]}},
                "operationName":"estimates"
            }
    }

    public async getAccessToken() : Promise<string> {
        const json = JSON.parse(readFileSync('./src/config/keys.json', 'utf8'));
        if(!this.isExpired(json)) return json.cabifyAccess.token;
        const {data} = await firstValueFrom(this.http.post(`${cabify.authUrl}?grant_type=client_credentials&client_id=${process.env.CABIFY_USER}&client_secret=${process.env.CABIFY_SECRET}`, {}));
        json.cabifyAccess = {
            token: data.access_token,
            expiresIn: moment().add(30, 'd').valueOf()
        }
        writeFileSync('./src/config/keys.json', JSON.stringify(json, null, 4), 'utf8');
        return data.access_token;
    }

    public isExpired(json : any) : boolean {
        return moment().isAfter(moment(json.cabifyAccess.expiresIn))
    }
}