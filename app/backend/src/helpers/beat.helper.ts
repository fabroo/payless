import { HttpService } from "@nestjs/axios";
import { Location } from "../interfaces/location";

export class BeatHelper {
    constructor(http: HttpService){}
    public async getPrice(from: Location, to : Location) : Promise<number> {
        return 0
    }
}