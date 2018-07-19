//import liraries
import React, { Component } from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation'

import stateStore from '@store/state'
// import MainScreen from './main'
// import SettingsScreen from './settings'
import ChatScreen from './chat'

// import {THEME} from "../settings";
// import {drawerButton} from "./ui";

const MainNavigator = DrawerNavigator({
  mainFlow:{
    screen: StackNavigator({
      // Main: {
      //   screen: MainScreen,
      //   navigationOptions: {
      //     gesturesEnabled: false
      //   }
      // },
      Chat: {
        screen: ChatScreen,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
    }, {
      navigationOptions: ({navigation}) => ({
        headerStyle: {elevation: 1,},
        // headerTintColor: THEME.headerColor,
        title: 'LIBRARY',
        // headerLeft: drawerButton(navigation),
        // headerRight: (<Badge containerStyle={{ backgroundColor: THEME.primaryColor, marginRight: 16}}>
        //   <Text style={{color: 'white'}}>{stateStore.tokens}</Text>
        // </Badge>),
      }),
      initialRouteName: 'Chat',
      headerMode: 'screen',
      cardStyle: {backgroundColor: 'white'}
    })
  },
}, {
  // contentComponent: DrawerContainer,
  // drawerWidth: 200,
  initialRouteName: 'mainFlow',
})

export default MainNavigator;
