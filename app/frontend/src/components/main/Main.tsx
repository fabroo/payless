import { Question, ArrowRight, MapPin, Heart } from "phosphor-react";
import { useEffect, useState } from "react"
import { FavouriteButton } from "./favourite-button/FavouriteButton";
import HelpModal from "./help-modal/HelpModal";
import axios from 'axios'
import environment from "../../environment/environment";
import { AutocompleteData, FocusData, OptionsData, PriceData } from "../../types/interfaces";
import { Prices } from "./prices/Prices";

export default function Main() {
    const [focused, setFocus] = useState<FocusData>({
        origin: false,
        destination: false
    })
    const [animation, setAnimation] = useState<boolean>(false)
    const [originValue, setOriginValue] = useState<string>('')
    const [destinationValue, setDestinationValue] = useState<string>('')
    const [favouritesClicked, setFavouritesClicked] = useState<boolean>(false)
    const [modalOpened, setModalOpened] = useState<boolean>(false)
    const [autocompleteValues, setAutocompleteValues] = useState<AutocompleteData[]>([])
    const [autocompleteType, setAutocompleteType] = useState<string | null>(null)
    const [selectedValues, setSelectedValues] = useState<OptionsData>({
        origin: null,
        destination: null
    })
    const [prices, setPrices] = useState<PriceData | null>(null)

    let handleFocus = (_e: any, type: string) => {
        setTimeout(()=> {
            setFocus({
                ...focused,
                [type]: true
            })
            setSelectedValues({
                ...selectedValues,
                [type]: null
            })
            search(type, type === 'origin' ? originValue : destinationValue)
        }, 100)
        
    }

    let handleBlur = (_e: any, type: string) => {
        setTimeout(()=> {
            setFocus({
                ...focused,
                [type]: false
            })
            setAutocompleteValues([])
        }, 100)
        
    }

    let search = async (type: string, val: string) => {
        if (val.length > 3 && !(!!selectedValues[type])) {
            const { data } = await axios.get(`${environment.API_URL}/autocomplete?query=${val}`)
            setAutocompleteType(type)
            setAutocompleteValues(data)
        }
    }

    let selectOption = (id: string) => {
        const option = autocompleteValues.find(option => option.id === id)
        console.log(option && autocompleteType)
        if (option && autocompleteType) {
            setSelectedValues({
                ...selectedValues,
                [autocompleteType]: option.id
            })
            setPrices(null)
            autocompleteType === 'origin' ? setOriginValue(option.main_text) : setDestinationValue(option.main_text)
        }
    }

    let getPrices = async () => {
        const {destination, origin} = selectedValues
        if(destination && origin) {
            const { data } = await axios.get<PriceData>(`${environment.API_URL}/prices?from=${origin}&to=${destination}`)
            setPrices(data)
        }

    }

    let clickFavourites = () => setFavouritesClicked(!favouritesClicked)

    let isFocused = () => focused.origin || focused.destination

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => setAnimation(!!focused.destination || !!focused.origin), 10);

        return () => clearTimeout(delayDebounceFn)
    }, [focused])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => search("origin", originValue), 2000)
        return () => clearTimeout(delayDebounceFn)
    }, [originValue])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => search("destination", destinationValue), 2000)
        return () => clearTimeout(delayDebounceFn)
    }, [destinationValue])

    return (
        <div className="flex flex-col">
            <HelpModal isOpen={modalOpened} setOpen={setModalOpened} />
            <div className={"flex flex-row justify-between mt-4 " + (animation ? 'oculto' : 'mostrado')}>
                <span className="font-kabel text-3xl text-whiteish">A donde vamos?</span>
                <button className="text-sm text-whiteish" onClick={() => setModalOpened(true)}>
                    <Question size={28} color={'#eee'}></Question>
                </button>
            </div>
            <div className={"flex flex-col " + (animation ? 'arriba' : 'abajo')}>
                <input
                    value={originValue}
                    onChange={e => setOriginValue(e.target.value)}
                    onFocus={e => handleFocus(e, "origin")}
                    onBlur={e => handleBlur(e, "origin")}
                    className="rounded-3xl bg-ocean-blue-600 w-full py-2 px-3 mt-4 text-whiteish"
                    placeholder="Origen">
                </input>
                <input
                    value={destinationValue}
                    onChange={e => setDestinationValue(e.target.value)}
                    onFocus={e => handleFocus(e, "destination")}
                    onBlur={e => handleBlur(e, "destination")}
                    className="rounded-3xl bg-ocean-blue-600 w-full py-2 px-3 mt-2 text-whiteish"
                    placeholder="Destino"
                >
                </input>
                <div className="flex flex-row justify-between mt-4">
                    <FavouriteButton isClicked={favouritesClicked} onClick={clickFavourites}  ></FavouriteButton>
                    <button onClick={()=>getPrices()} className="flex items-center justify-center rounded-3xl bg-light-pink w-10 h-10">
                        <ArrowRight size={24} color="#2E2F47"></ArrowRight>
                    </button>
                </div>

            </div>

            <div className={"flex mt-2 " + (animation ? 'arriba' : 'abajo')}>
                {/* autocomplete values */}
                {
                    isFocused() && <div className="flex flex-col w-full">
                        {autocompleteValues.map(autocomplete =>
                            <div 
                                onClick={() => selectOption(autocomplete.id)} 
                                className="flex flex-row justify-between items-center m-2" 
                                key={autocomplete.id}
                            >
                                <div className="w-1/6">
                                    <MapPin color="#CECECE"  size={28} />
                                </div>
                                
                                <div className="flex flex-col w-5/6">
                                    <span className="text-whiteish" >{autocomplete.main_text}</span>
                                    <span className="text-xs" style={{color:'#CECECE'}}>{autocomplete.secondary_text}</span>
                                </div>
                                <div className="w-1/6 flex justify-end">
                                    <Heart color="#CECECE" size={28} />
                                </div>
                            </div>
                        )}
                    </div>
                } 
                {
                    !isFocused() && prices && <Prices prices={prices}></Prices>
                }
            </div>
        </div>
    )
}