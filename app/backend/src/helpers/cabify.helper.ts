import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Location } from "../interfaces/location";

@Injectable()
export class CabifyHelper {
    constructor(http: HttpService){}
    public async getPrice(from: Location, to : Location) : Promise<number> {
        return 0
    }
}