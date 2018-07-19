import { AsyncStorage } from 'react-native'
import { observable, runInAction, action, autorun, computed, reaction, ObservableMap } from 'mobx';
import { findIndex } from 'lodash'

class StateStore {
  @observable isInit = true; // Activity indicator status
  @observable isLoading = false; // Activity indicator status
  @observable isAuthenticated = false; // Is User authenticated
  @observable isConnected = false // Internet connection
  @observable isForeground = false // Is app foreground
  @observable connected = null
  @observable detected = null
  @observable message = null
  @observable invite = null


  constructor () {
    autorun(() => {console.log('isAuthenticated', this.isAuthenticated)})
    autorun(() => {console.log('isConnected', this.isConnected)})
    autorun(() => {console.log('isForeground', this.isForeground)})
  }

  @action clearStore = () => {
    this.isAuthenticated = false
    this.user = null
  }

}

export default new StateStore();