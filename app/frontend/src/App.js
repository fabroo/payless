import { Component } from "react";
import "./App.css";
import { ArrowRight, Heart } from "react-feather";

export default class App extends Component {
  state = {
    isLoading: false,
    onText: false,
    destination: {
      text: "",
      selected: false,
      latlng: []
    },
    origin: {
      text: "",
      selected: false,
      latlng: []
    },
    prices: {
      uber: null,
      didi: null,
      cabi: null,
      beat: null
    },
    favouritesClicked: false,
    favourites: []
  }

  handleChange = (e, type) => {
    this.setState({
      [type]: {
        text: e.target.value,
      }
    })
  }

  handleFocus = (event, type) => {
    console.log("el diablo", type)
  }

  clickFavourites = () => this.setState({ favouritesClicked: !this.state.favouritesClicked })

  render() {
    return (
      <div className="flex flex-col mt-8 mx-3">
        <div className="flex flex-row justify-between">
          <span className="font-kabel text-3xl text-whiteish">A donde vamos?</span>
          <button className="text-sm text-whiteish">
            svg
          </button>
        </div>
        <div className="flex flex-col">
          <input 
            value={this.state.origin.text}
            onChange={(event) => this.handleChange(event, "origin")}
            className="rounded-3xl bg-ocean-blue-600 w-full py-2 px-3 mt-4 text-whiteish" 
            placeholder="Origen">
          </input>  
          <input className="rounded-3xl bg-ocean-blue-600 w-full py-2 px-3 mt-2 text-whiteish" placeholder="Destino"></input> 
        </div>
        <div className="flex flex-row justify-between mt-4">
          <button onClick={this.clickFavourites} className={"ease-in flex flex-row items-center px-3 py-2 rounded-3xl " + (this.state.favouritesClicked ? 'bg-light-pink' : 'bg-ocean-blue-700')}>
            <Heart className="mx-1 ease-in" fill="#383951" size={20} color={this.state.favouritesClicked ? '#383951' : '#EEE'}></Heart>
            <span className={(this.state.favouritesClicked ? 'text-ocean-blue-800' : 'text-whiteish') +" mx-2 font-medium ease-in"}>Favoritos</span>
          </button>
          <button className="flex items-center justify-center rounded-3xl bg-light-pink w-10 h-10">
            <ArrowRight size={24} color="#2E2F47"></ArrowRight>
          </button>
        </div>
      </div>
    )
  }
}
