import { Component } from "react"

export default class Test extends Component {

  render() {
    return (
      <div>
        <h3 className="App">
            {this.props.diablo}
        </h3>
        <button onClick={event => this.props.funcionCabrona(event, 'que tu dice')}>
            Click
        </button>
      </div>
    )
  }
}