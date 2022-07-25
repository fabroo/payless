import { PriceData } from "../../../types/interfaces";
import BeatLogo from './svg/beat-logo.svg'
import UberLogo from './svg/uber-logo.svg'
import DidiLogo from './svg/didi-logo.svg'
import CabiLogo from './svg/cabify-logo.svg'

interface PriceProps {
    prices: PriceData
}

export function Prices({ prices: { cabi, didi, uber, beat } }: PriceProps) {
    return (
        <div className="flex flex-col w-full items-center mt-16 justify-center text-white">

            <div className="flex flex-row w-full mx-6">
                <div className="rounded-2xl flex flex-col justify-center items-center bg-cabi w-1/2 mr-2 p-5 ease">
                    <img  className="w-20" src={CabiLogo} alt="" />
                    <span className="font-kabel mt-3 text-3xl font-semibold">${cabi}</span>
                </div>

                <div className="rounded-2xl flex flex-col justify-center items-center bg-didi w-1/2 mr-2 p-5 ease">
                    <img  className="w-20" src={DidiLogo} alt="" />
                    <span className="font-kabel mt-3 text-3xl font-semibold">${didi}</span>
                </div>
            </div>
            <div className="flex mt-3 flex-row w-full mx-6">
                <div className="rounded-2xl flex flex-col justify-center items-center bg-beat w-1/2 mr-2 p-5 ease">
                    <img  className="w-20" src={BeatLogo} alt="" />
                    <span className="font-kabel mt-3 text-3xl font-semibold">${beat}</span>
                </div>

                <div className="rounded-2xl flex flex-col justify-center items-center bg-uber w-1/2 mr-2 p-5 ease">
                    <img  className="w-20" src={UberLogo} alt="" />
                    <span className="font-kabel mt-3 text-3xl font-semibold">${uber}</span>
                </div>
            </div>
        </div>
    )
}