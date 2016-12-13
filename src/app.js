import React, { Component } from 'react';
//import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import firebase from 'firebase';

import reducers from './reducers';
import Router from './Router';
//import { Header } from './components/common';


class App extends Component {
    componentWillMount() {
        const config = {
            apiKey: 'AIzaSyC7XrPq55NOGacu6stgaRgHhMHXRVoz2dg',
            authDomain: 'manager-75a33.firebaseapp.com',
            databaseURL: 'https://manager-75a33.firebaseio.com',
            storageBucket: 'manager-75a33.appspot.com',
            messagingSenderId: '649191817236'
        };

        firebase.initializeApp(config);
    }

    render() {
        const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
        return (
            <Provider store={store} >
                <Router />
            </Provider>
        );
    }
}

export default App;
