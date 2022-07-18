import { Heart } from "phosphor-react";

interface FavouriteButtonProps {
    isClicked: boolean;
    onClick: () => void;
}

export function FavouriteButton({isClicked, onClick} : FavouriteButtonProps) {
    return (
        <button onClick={onClick} className={"ease flex flex-row items-center px-3 py-2 rounded-3xl " + (isClicked ? 'bg-light-pink' : 'bg-ocean-blue-700')}>
            <Heart className="mx-1 ease" fill="#383951" size={20} color={isClicked ? '#383951' : '#EEE'}></Heart>
            <span className={(isClicked ? 'text-ocean-blue-800' : 'text-whiteish') +" mx-2 font-medium ease"}>Favoritos</span>
        </button>
    )
}