import React, { Component } from 'react'; 
import firebase from 'firebase/app';
import config from '../config/firebase-config';
import Header from './Header';
import Points from './Points';

class App extends Component {
    constructor() {
        super();
            // Initialize Firebase
        firebase.initializeApp(config);
    }

    render() {
        return (
            <div className="App">
                <Header />
                <Points />
            </div>
        );
    }
}
export default App;