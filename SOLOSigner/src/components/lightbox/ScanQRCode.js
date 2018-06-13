import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Camera from 'react-native-camera';

type Props = {};
export default class BarcodeScan extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            address: ''
        };
    }

    onBarCodeRead = (e) => {
      const { navigation } = this.props;
      navigation.state.params.scanQRCodeCallback(e.data);
      navigation.goBack();
    }

    render () {
        return (
            <View  style={styles.container}>
                <Camera
                    style={styles.preview}
                    onBarCodeRead={this.onBarCodeRead}
                    ref={cam => this.camera = cam}
                    aspect={Camera.constants.Aspect.fill}>
                </Camera>
                <Button title='Back' onPress={() => Actions.jump('tab_bip38', {address: ''})}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});
