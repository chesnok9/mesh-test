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

let BluetoothCP = require("react-native-bluetooth-cross-platform")
BluetoothCP.advertise("WIFI-BT")

type Props = {};
export default class Status extends Component<Props> {
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

  callback = (user) => {
    console.log('connected listener', user)
    this.setState({connected: user})
  }

  nearbyCallback = (user) => {
    console.log('nearby', user)
    // this.setState({user})
  }

  connectedCallback = (user) => {
    console.log('connected peers', user)
    this.setState({connected: user})
  }

  detectedCallback = (user) => {
    console.log('detected', user)
    this.setState({detected: user})
  }

  lostCallback = (user) => {
    console.log('lost', user)
    // this.setState({connected: user})

  }

  messageCallback = (message, data) => {
    // do stuff
    console.log('message received', message, data)
    this.setState({message})
  }

  inviteCallback = (data) => {
    // do stuff
    console.log('invite', data)
    this.setState({invite: data})
  }

  sendInvite = (id) => {
    console.log('Send invite', id)
    BluetoothCP.inviteUser(id)
  }

  acceptInvite = (id) => {
    console.log('Accept invite', id)
    BluetoothCP.acceptInvitation(id)
  }

  sendMessage = (id) => {
    console.log('Send message', id)
    BluetoothCP.sendMessage('Test message', id)
  }

  componentDidMount() {
    this.listener1 = BluetoothCP.addPeerDetectedListener(this.detectedCallback)
    this.listener2 = BluetoothCP.addPeerLostListener(this.lostCallback)
    this.listener3 = BluetoothCP.addReceivedMessageListener(this.messageCallback)
    this.listener4 = BluetoothCP.addInviteListener(this.inviteCallback)
    this.listener5 = BluetoothCP.addConnectedListener(this.callback)

    BluetoothCP.getNearbyPeers(this.nearbyCallback)
    BluetoothCP.getConnectedPeers(this.connectedCallback)
  }

  componentWillUnmount() {
    this.listener1.remove()
    this.listener2.remove()
    this.listener3.remove()
    this.listener4.remove()
    this.listener5.remove()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>MESH App 12</Text>

        <Text style={styles.welcome}>User</Text>
        <Text>{JSON.stringify(this.state.user)}</Text>

        <Text style={styles.welcome}>Detected</Text>
        <Text>{JSON.stringify(this.state.detected)}</Text>
        {this.state.detected && this.state.detected.id
          ? <Button onPress={() => this.sendInvite(this.state.detected.id)} title="Invite"/>
          : null
        }
        {this.state.detected && this.state.detected.id
          ? <Button onPress={() => this.sendMessage(this.state.detected.id)} title="Send Message"/>
          : null
        }

        <Text style={styles.welcome}>Connected</Text>
        <Text>{JSON.stringify(this.state.connected)}</Text>

        <Text style={styles.welcome}>Message</Text>
        <Text>{JSON.stringify(this.state.message)}</Text>

        <Text style={styles.welcome}>Invite</Text>
        <Text>{JSON.stringify(this.state.invite)}</Text>
        {this.state.invite && this.state.invite.id
          ? <Button onPress={() => this.acceptInvite(this.state.invite.id)} title="Accept"/>
          : null
        }

      </View>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
