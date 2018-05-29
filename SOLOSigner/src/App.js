import React, { Component } from 'react';
import { StyleSheet, TextInput, Text, View, Button } from 'react-native';

export default class App extends Component {
    constructor(prods) {
        super(prods);
        this.state = {count: 1};
    }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{width:200, height: 40, padding: 10}}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
