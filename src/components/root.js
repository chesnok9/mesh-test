import React, { Component } from 'react'
import { AsyncStorage, AppState, NetInfo } from 'react-native'
import {observer, inject} from "mobx-react/native"
import SplashScreen from './splash'
import MainNavigator from './navigator'
import {addNavigationHelpers} from "react-navigation";

let BluetoothCP = require("react-native-bluetooth-cross-platform")
BluetoothCP.advertise("WIFI-BT")

@inject('stateStore', 'meshStore', 'rootNavigation')
@observer
class Root extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount () {
    const { meshStore } = this.props
    // AppState.addEventListener('change', this.props.sessionStore.handleAppStateChange);
    // NetInfo.getConnectionInfo().then((connectionInfo) => {
    //   console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    // });

    // NetInfo.isConnected.addEventListener('connectionChange', this.props.sessionStore.handleConnectionChange);

    this.listener1 = BluetoothCP.addPeerDetectedListener(meshStore.detectedCallback)
    this.listener2 = BluetoothCP.addPeerLostListener(meshStore.lostCallback)
    this.listener3 = BluetoothCP.addReceivedMessageListener(meshStore.messageCallback)
    this.listener4 = BluetoothCP.addInviteListener(meshStore.inviteCallback)
    this.listener5 = BluetoothCP.addConnectedListener(meshStore.connectedCallback)

    // BluetoothCP.getNearbyPeers(this.nearbyCallback)
    // BluetoothCP.getConnectedPeers(this.connectedCallback)
  }

  componentWillUnmount() {
    console.log('app unmounted')
    // NetInfo.isConnected.removeEventListener(
    //   'connectionChange',
    //   this.props.sessionStore.handleConnectionChange
    // )

    this.listener1.remove()
    this.listener2.remove()
    this.listener3.remove()
    this.listener4.remove()
    this.listener5.remove()
  }

  render() {
    const { state, dispatch, addListener } = this.props.rootNavigation;

    if (!this.props.stateStore.isInit) {
      return <SplashScreen />
    } else {
      return <MainNavigator navigation={addNavigationHelpers({state, dispatch, addListener})}/>
    }
  }
}

export default Root;
