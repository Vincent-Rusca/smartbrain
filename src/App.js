import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';

const particlesOptions = {
  particles: {
    number: {
      value: 30
    },
    line_linked: {
      color: '#FFF',
      shadow: {
        enable: false
      }
    },
    move: {
      enable: true,
      random: true,
      straight: false,
      speed: 1.2
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  // componentDidMount() {
  //   fetch('http://localhost:3001')
  //   .then(response => response.json())
  //   .then(console.log)
  // }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocations = (data) => {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    let faceBoxArray = [];
    data.outputs[0].data.regions.forEach(element => {
      let clarifaiRawFaceData = element.region_info.bounding_box;
      //console.log(clarifaiRawFaceData)
      faceBoxArray.push({
        leftCol: clarifaiRawFaceData.left_col * width,
        topRow: clarifaiRawFaceData.top_row * height,
        rightCol: width - (clarifaiRawFaceData.right_col * width),
        bottomRow: height - (clarifaiRawFaceData.bottom_row * height)
      })
    });
    //const clarifaiFaceData = data.outputs[0].data.regions[0].region_info.bounding_box;
    
    return faceBoxArray;
  }

  onRouteChange = (route) => {
    if(route === 'home') {
      this.setState({isSignedIn: true})
    }else if(route=== 'signin') {
      this.setState(initialState)
    }
    this.setState({route: route});
  }

  displayFaceBoxes = (boxes) => {
    //console.log(box);
    this.setState({boxes: boxes});
  }

  onInputChange = e => {
    this.setState({input: e.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://damp-mountain-47328.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input,
        })
      })
    .then(response => response.json())
    .then(response => {
      fetch('https://damp-mountain-47328.herokuapp.com/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id,
        })
      })
      .then(response => response.json())
      .then(count => {
        this.setState(
          Object.assign(this.state.user, { entries: count })
        )
      })
      .catch(console.log);
      console.log('Request successful!');
      this.displayFaceBoxes(this.calculateFaceLocations(response));
    }, error => {
      console.log('ERROR: ' + error);
    });
  }

  getComponent() {
    switch(this.state.route) {
      case 'home':
        return (
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit} />
            <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl} />
          </div>
        )
      case 'signin':
        return (<SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />)
      case 'register':
        return (<Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />)
      default:
        return(<p>ERROR</p>)
    }
  }

  render() {
    // return (
    //   <div className="App">
    //     <Particles className='particles'
    //       params={particlesOptions}
    //     />
    //     <Navigation onRouteChange={this.onRouteChange} />
    //     {this.state.route === 'signin'
    //       ? <SignIn onRouteChange={this.onRouteChange} />
    //       : <div>
    //         <Logo />
    //         <Rank />
    //         <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
    //         <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
    //       </div>
    //     }
    //   </div>
    // );

    return (
        <div className="App">
          <Particles className='particles'
            params={particlesOptions}
          />
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
          {this.getComponent()}
        </div>
      );
  }
}

export default App;
