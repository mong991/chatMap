/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';

import { AppRegistry } from 'react-native';

import dva from 'dva/mobile';

import Router from './src/Router';

import Auth from './src/models/Auth';

const app = dva();

app.model(Auth);

app.router(() => <Router />);

AppRegistry.registerComponent('chatMap', () => app.start());
