import { Component } from 'react';
import './App.css';
import InputHeader from './components/input-header/InputHeader';

export default class App extends Component {
  state = {
    favouritesClicked: false,
    favourites: []
  }

  finishedTyping = (type, text) => {
    console.log("we do axios that shit", type, text)
  }

  render() {
    return (
      <div className="flex flex-col mt-4 mx-3">
        <InputHeader 
          onFinishedTyping={this.finishedTyping}
        >
        </InputHeader>
        
      </div>
    )
  }
}