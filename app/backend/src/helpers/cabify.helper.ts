import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import { firstValueFrom } from "rxjs";
import { cabify } from "src/config/environment";
import { asArray, Location } from "../interfaces/location";

@Injectable()
export class CabifyHelper {
    constructor(private http: HttpService){}
    public async getPrice(from: Location, to : Location) : Promise<number> {
        try {
            const token = JSON.parse(readFileSync('./src/config/keys.json', 'utf8')).cabifyAccess;
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
                "requesterId":"f21c5d04d11e11ecbd628202deb78cf2",
                "startType":"ASAP",
                "startAt":"",
                "stops":[{"loc":asArray(from)},{"loc":asArray(to)}]}},
                "operationName":"estimates"
            }
    }
}