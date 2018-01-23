import React, { Component } from 'react';
import './App.css';
import Map from './Map';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      latitude: -73.950,
      longitude: 40.702
    }
    this.findMe = this.findMe.bind(this);
  }

  success(position) {
    this.setState(
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    )
  }

  error() {

  }

  findMe() {
    navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error);
  }

  render() {
    return (
      <div>
       <Map lat={this.state.latitude} log={this.state.longitude}/>
       <button onClick={this.findMe}> find me </button>
       <span> latitude is {this.state.latitude? this.state.latitude: 'not available'} </span>
       <span> longitude is {this.state.longitude? this.state.longitude : 'not available' } </span>
     </div>
    );
  }
}

export default App;
