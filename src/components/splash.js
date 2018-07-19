import React, { Component } from 'react';
import {View, StyleSheet, ImageBackground, Image, Text} from 'react-native';

class SplashScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <Text>Mesh Chat</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SplashScreen;
