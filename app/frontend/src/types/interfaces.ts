export interface FocusData {
    origin: boolean;
    destination: boolean;
}

export interface AutocompleteData {
    main_text: string;
    secondary_text: string;
    id: string;
}

export interface OptionsData {
    origin: string | null,
    destination: string | null
}

export interface PriceData {
    cabi: number,
    didi: number,
    uber: string,
    beat: string
}