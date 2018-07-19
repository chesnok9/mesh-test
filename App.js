/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import store from '@store'
import {Provider} from "mobx-react/native";
import NavigationStore from 'react-navigation-mobx-helpers'
import Root from "./src/components/root";
import MainNavigator from './src/components/navigator'

const rootNavigation = new NavigationStore(MainNavigator)

type Props = {};
export default class App extends Component<Props> {
  state = {
    user: null,
    detected: null,
    connected: null,
    message: null,
    invite: null,
  }

  constructor(props) {
    super(props)
    console.disableYellowBox = true;
  }

  render() {
    return (
      <Provider rootNavigation={rootNavigation} {...store}>
        <Root />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
