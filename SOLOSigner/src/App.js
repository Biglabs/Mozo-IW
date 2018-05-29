import React, { Component } from 'react';
import { TextInput, Text, View, Button } from 'react-native';
import styles from './style/common.js';

export default class App extends Component {
    constructor(prods) {
        super(prods);
        this.state = {count: 1};
    }
  render() {
    return (
      <View style={styles.container}>
        
        <TextInput style={styles.text_input}
          placeholder="key"
          onChangeText={(text) => this.setState({text})}
        />

        <Button title="Click me!" onPress= { () =>
            console.log('clicked ' + this.state.count++)
        }/>

      </View>
    );
  }
}
