import { HttpService } from "@nestjs/axios";
import { Location } from "../interfaces/location";
import { didi } from "../config/environment";
import { firstValueFrom } from "rxjs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DidiHelper {
    constructor(private http: HttpService){}
    public async getPrice(from: Location, to : Location) : Promise<number> {
        try {
            const {data} = await firstValueFrom(this.http.post(didi.requestUrl, this.generateDidiBody(from, to)))
            return Number(this.getPriceFromJSON(data))

        } catch (error) {
            throw error
        }
        
    }

    public getPriceFromJSON(json : Record<string, any>) {
        return Number(json.data.abilities['xEngine/passenger'].data.passenger_eyeball_estimate.data.data.estimate_data[0].items[0].cars_info_detail[0].car_detail[0].origin_fee.split(' ')[1])
    }

    public generateDidiBody(from : Location, to : Location) : any {
        return {
            "abilities": {
                "xEngine/passenger": {
                    "biz_param": {
                        "passenger_eyeball_estimate": {
                            "from_lng": from.lng,
                            "from_lat": from.lat,
                            "to_lng": to.lng,
                            "to_lat": to.lat,
                            "carpool_seat_num": "1"
                        }
                    },
                    "scene": "xEngine_estimate"
                }
            },
            "common": {
                "app_version": "7.2.84",
                "location_country": "AR",
                "terminal_id": 7,
                "ticket": process.env.DIDI_TICKET,
                "city_id": 54052300
            }
        }
    }
}