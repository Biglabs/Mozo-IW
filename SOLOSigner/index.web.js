import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';

import App from './src/App';

/* export default class GHViewer extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native and Electron!
        </Text>
      </View>
    )
  }
} */

/* const styles = StyleSheet.create({
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
}) */

// import * as services from "./src/services/index.js";

// console.log("Index.web.js: services ");
// services.manageWallet();

AppRegistry.registerComponent('SOLOSigner', () => App);

AppRegistry.runApplication('SOLOSigner', {
  rootTag: document.getElementById('root')
});
