import { Question, ArrowRight } from "phosphor-react";
import { useEffect, useState } from "react"

import { FavouriteButton } from "../favourite-button/FavouriteButton";

export default function InputHeader(props) {
    const [focused, setFocus] = useState({
        origin: false,
        destination: false
    }) 
    const [animation, setAnimation] = useState(false)
    const [originValue, setOriginValue] = useState('')
    const [destinationValue, setDestinationValue] = useState('')
    const [favouritesClicked, setFavouritesClicked] = useState(false)

    let handleFocus = (e, type) => setFocus({
        ...focused,
        [type]: true
    })

    let handleBlur = (e, type) => 
        setFocus({
            ...focused,
            [type]: false
        })
    

    let handleChange = (type, val) => {
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
            <div className={"flex flex-row justify-between mt-4 " + (animation ? 'oculto' : 'mostrado')}>
                <span className="font-kabel text-3xl text-whiteish">A donde vamos?</span>
                <button className="text-sm text-whiteish">
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