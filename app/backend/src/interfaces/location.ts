export interface Location {
    lat: number,
    lng : number
}

export interface LocationGroup {
    from: Location,
    to: Location
}

export interface MultipleLocationGroup {
    from: Location,
    to: Location[]
}