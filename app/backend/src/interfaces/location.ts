export interface Location {
    lat: string,
    lng : string
}

export function asArray(location: Location) : number[] {
    return [Number(location.lat), Number(location.lng)]
}

export interface LocationGroup {
    from: Location,
    to: Location
}

export interface MultipleLocationGroup {
    from: Location,
    to: Location[]
}