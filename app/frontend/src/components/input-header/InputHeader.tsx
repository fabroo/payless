import { Question, ArrowRight } from "phosphor-react";
import { useEffect, useState } from "react"

import { FavouriteButton } from "../favourite-button/FavouriteButton";
import HelpModal  from "../help-modal/HelpModal";
interface FocusData {
    origin: boolean;
    destination: boolean;
}

export default function InputHeader(props) {
    const [focused, setFocus] = useState<FocusData>({
        origin: false,
        destination: false
    }) 
    const [animation, setAnimation] = useState<boolean>(false)
    const [originValue, setOriginValue] = useState<string>('')
    const [destinationValue, setDestinationValue] = useState<string>('')
    const [favouritesClicked, setFavouritesClicked] = useState<boolean>(false)
    const [modalOpened, setModalOpened] = useState<boolean>(false)

    let handleFocus = (_e : any, type : string) => setFocus({
        ...focused,
        [type]: true
    })

    let handleBlur = (_e: any, type : string) => 
        setFocus({
            ...focused,
            [type]: false
        })
    

    let handleChange = (type: string, val: string) => {
        if (val.length > 3) props.onFinishedTyping(type, val)
    }

    let clickFavourites = () => setFavouritesClicked(!favouritesClicked)

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => setAnimation(!!focused.destination || !!focused.origin), 10);
        
        return () => clearTimeout(delayDebounceFn)
    }, [focused])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => handleChange("origin", originValue), 2000)
        return () => clearTimeout(delayDebounceFn)
    }, [originValue])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => handleChange("destionation", destinationValue), 2000)
        return () => clearTimeout(delayDebounceFn)
    }, [destinationValue])

    return (
        <div className="flex flex-col">
            <HelpModal isOpen={modalOpened} setOpen={setModalOpened} />
            <div className={"flex flex-row justify-between mt-4 " + (animation ? 'oculto' : 'mostrado')}>
                <span className="font-kabel text-3xl text-whiteish">A donde vamos?</span>
                <button className="text-sm text-whiteish" onClick={()=>setModalOpened(true)}>
                    <Question size={28} color={'#eee'}></Question>
                </button>
            </div>
            <div className={"flex flex-col " + (animation ? 'arriba' : 'abajo')}>
                <input
                    value={originValue}
                    onChange={e => setOriginValue(e.target.value)}
                    onFocus={e =>handleFocus(e, "origin")}
                    onBlur={e =>handleBlur(e, "origin")}
                    className="rounded-3xl bg-ocean-blue-600 w-full py-2 px-3 mt-4 text-whiteish"
                    placeholder="Origen">
                </input>
                <input
                    value={destinationValue}
                    onChange={e => setDestinationValue(e.target.value)}
                    onFocus={e =>handleFocus(e, "destination")}
                    onBlur={e =>handleBlur(e, "destination")}
                    className="rounded-3xl bg-ocean-blue-600 w-full py-2 px-3 mt-2 text-whiteish"
                    placeholder="Destino"
                >
                </input>
                <div className="flex flex-row justify-between mt-4">
                    <FavouriteButton isClicked={favouritesClicked} onClick={clickFavourites}  ></FavouriteButton>
                    <button className="flex items-center justify-center rounded-3xl bg-light-pink w-10 h-10">
                        <ArrowRight size={24} color="#2E2F47"></ArrowRight>
                    </button>
                </div>
            </div>

        </div>
    )
}