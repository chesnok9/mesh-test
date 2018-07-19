import {action, runInAction, autorun} from 'mobx'
import { findIndex, find, forEach, isArray } from 'lodash'
import moment from 'moment'
import realm from '@store/realm';
import stateStore from '@store/state';

let BluetoothCP = require("react-native-bluetooth-cross-platform")
BluetoothCP.advertise("WIFI-BT")

class MeshStore {
  constructor () {
  }

  @action nearbyCallback = (user) => {
    console.log('nearby', user)
    // this.setState({user})
  }

  @action connectedCallback = (user) => {
    console.log('connected peers', user)
    stateStore.connected = user
  }

  @action detectedCallback = (user) => {
    console.log('detected', user)
    stateStore.detected = user
  }

  @action lostCallback = (user) => {
    console.log('lost', user)
    // this.setState({connected: user})

  }

  @action sendMessageFromId = (id) => {
    // do stuff
    console.log('message received', id)
    BluetoothCP.sendMessage('Test message', id)
  }

  @action messageCallback = (data) => {
    // do stuff
    console.log('message received', data)
    stateStore.message = data
    this.storeMessage(data.message, data.name, data.id)
  }

  @action inviteCallback = (data) => {
    // do stuff
    console.log('invite', data)
    stateStore.invite = data
  }

  @action sendInvite = (id) => {
    console.log('Send invite', id)
    BluetoothCP.inviteUser(id)
  }

  @action acceptInvite = (id) => {
    console.log('Accept invite', id)
    BluetoothCP.acceptInvitation(id)
  }

  @action sendMessage = (message, cb) => {
    console.log('Send message', message)
    if (stateStore.detected) {
      if (isArray(stateStore.detected)) {
        forEach(stateStore.detected, (item) => {
          BluetoothCP.sendMessage(message, item.id)
        })
      } else {
        BluetoothCP.sendMessage(message, stateStore.detected.id)
      }
    }

    this.storeMessage(message, null, null, cb)
  }


  @action storeMessage = (message, name = null, senderId = null, cb) => {
    console.log('Store message', message, name, senderId)

    const collection = realm.objects('messages')
    let maxId = 0

    if (collection.length > 0) {
      forEach(collection, (item) => {
        if (item.id > maxId) {
          maxId = item.id
        }
      });
    }

    const data = {
      id: maxId + 1,
      message: message,
      senderId: senderId,
      name: name || 'I',
      createdAt: new Date
    }

    try {
      realm.write(() => {
        realm.create('messages', data, true);

        if (cb && typeof cb === 'function') {
          cb(true)
        }
      });
    } catch (error) {
      console.log('realm create art', error)

      if (cb && typeof cb === 'function') {
        cb(false)
      }
    }


  }
}

export default new MeshStore();