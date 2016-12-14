/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';

import { AppRegistry } from 'react-native';

import dva from 'dva/mobile';

import Router from './src/Router';

import Initial from './src/models/Initial';
import Auth from './src/models/Auth';
import Message from './src/models/Message';

const app = dva();

app.model(Initial);
app.model(Auth);
app.model(Message);

app.router(() => <Router />);

AppRegistry.registerComponent('chatMap', () => app.start());
