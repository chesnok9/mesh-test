import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Keyboard, FlatList,
  Button
} from 'react-native';
import {observer, inject} from "mobx-react/native"
import { forEach, size } from 'lodash'
import moment from 'moment'
import realm from '@store/realm';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import images from '../utils/images'

@inject('meshStore', 'stateStore')
@observer
class UsersScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Messages',
      // headerLeft: backButton(navigation),
    }
  }
  constructor(props) {
    super(props)

    this.data_source = realm.objects('messages');
    this.data_source.addListener(this.onChange);
    this.state = {
      message: '',
      old: true,
      offset: 0
    }
  }

  onChange = (name, changes) => {
    console.log('onChange', this.data_source, this.data_source && this.data_source.length, this.data_source && this.data_source.slice())

    this.forceUpdate();
  }

  submit = () => {
    const {message} = this.state
    console.log('message', message)

    if (message && message.trim()) {
      this.props.meshStore.sendMessage(message, (res) => {
        if (res) {
          this.setState({message: ''})
        }
      })
    }
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHide.bind(this));
  }

  componentDidMount() {
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.data_source.removeListener(this.onChange);
  }

  _keyboardShow (e) {
    this.setState({offset: e.endCoordinates.height})
  }

  _keyboardHide () {
    this.setState({offset: 0})
  }

  renderFooter() {
    const {message} = this.state
    return (
      <View style={styles.addComment}>
        <TextInput
          style={styles.newComment}
          value={message}
          underlineColorAndroid='transparent'
          placeholder='Write message here...'
          onChangeText={(e) => {this.setState({message: e})}}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={this.submit}
        >
          <Image
            style={styles.sendIcon}
            source={images.commentSend}
            resizeMode='contain'
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderMessage({item, index}) {
    return (
      <View key={index} style={styles.commentContainer}>

        <View style={styles.commentHeader}>
          <Text style={styles.commentOwner}>{item.name}</Text>
          <Text style={styles.commentTime}>{moment(item.created).fromNow()}</Text>
        </View>

        <Text style={styles.commentText}>{item.message}</Text>

      </View>
    )
  }

  render() {
    const { offset } = this.state
    const { stateStore, meshStore } = this.props
    return (
      <KeyboardAwareScrollView contentContainerStyle={[styles.container, {paddingBottom: offset}]}>
        <View style={styles.container}>
          <Text style={styles.subtitle}>Detected</Text>
          <Text>{JSON.stringify(stateStore.detected)}</Text>
          {stateStore.detected && stateStore.detected.id
            ? <Button onPress={() => meshStore.sendInvite(stateStore.detected.id)} title="Invite"/>
            : null
          }
          {stateStore.detected && stateStore.detected.id
            ? <Button onPress={() => meshStore.sendMessageFromId(stateStore.detected.id)} title="Send Message"/>
            : null
          }

          <Text style={styles.subtitle}>Connected</Text>
          <Text>{JSON.stringify(stateStore.connected)}</Text>

          <Text style={styles.subtitle}>Message</Text>
          <Text>{JSON.stringify(stateStore.message)}</Text>

          <Text style={styles.subtitle}>Invite</Text>
          <Text>{JSON.stringify(stateStore.invite)}</Text>
          {stateStore.invite && stateStore.invite.id
            ? <Button onPress={() => meshStore.acceptInvite(stateStore.invite.id)} title="Accept"/>
            : null
          }

        </View>
        <ScrollView
          style={{flex: 1}}
        >
          <FlatList
            keyExtractor={(item) => `${item.id}`}
            data={this.data_source.slice()}
            renderItem={this.renderMessage}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
        {
          this.renderFooter()
        }
      </KeyboardAwareScrollView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between'
  },
  header: {
    width: '100%',
    height: 60,
    paddingTop: 20,
    borderRadius: 5,
    // borderBottomWidth: 2,
    // borderColor: '#ccc',
    marginBottom: 5,
    shadowOffset: {width: 0, height: 5},
    shadowColor: '#000',
    shadowOpacity: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
  },
  headerBackButton: {
    width: 15,
    height: 15,
  },
  addComment: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  newComment: {
    flex: 1,
    paddingLeft: 15,
    fontSize: 16,
    height: '100%',
  },
  sendButton: {
    marginLeft: 20,
    marginRight: 20,
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
  postContainer: {
    borderRadius: 10,
    backgroundColor: '#94fbaa',
    width: '100%',
    paddingTop: 5,
    marginBottom: 2,
  },
  commentContainer: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    paddingLeft: 15,
    paddingBottom: 5,
    backgroundColor: 'white'
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  commentOwner: {
    color: '#777'
  },
  commentTime: {
    marginRight: 5,
  },
  commentText: {
    fontSize: 17,
    marginBottom: 10,
  },
  subtitle: {
    fontWeight: 'bold'
  }
});

//make this component available to the app
export default UsersScreen;
