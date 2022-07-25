import { Injectable } from "@nestjs/common";
import { Location } from "../interfaces/location";

@Injectable()
export class UberHelper {
    public async getPrice(from: Location, to : Location) : Promise<string> {
        return "780";
    }
}