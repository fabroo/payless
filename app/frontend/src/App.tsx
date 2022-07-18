import { Component } from 'react';
import './App.css';
import Main from './components/main/Main';

export default class App extends Component {
  render() {
    return (
      <div className="mt-4 mx-3">
        <Main/>
      </div>
    )
  }
}