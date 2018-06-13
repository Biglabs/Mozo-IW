import React, {Component} from "react";
import {ScrollView, TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import SvgUri from 'react-native-svg-uri';
import {Button, Text, TextInput} from "../../components/SoloComponent";
import {RNCamera} from 'react-native-camera';

export default class ImportWalletScreen extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {scanningQRCode: false}
    }

    onSubmitPhrase(phrase) {
        console.log(phrase);
    }

    render() {
        return (
            <View style={styles.container}>

                <Text style={StyleSheet.value('$screen_title_text')}>Import/Restore Wallet</Text>

                <Text style={StyleSheet.value('$screen_sub_title_text')}>
                    Type in your wallet’s Backup Phrase in the correct sequence below to pair.
                </Text>

                <ScrollView
                    style={styles.scroll_container}
                    contentContainerStyle={{alignItems: 'center'}}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    overScrollMode='never'>
                    <TextInput
                        style={styles.phrase_input}
                        placeholder='Enter Backup Phrase'
                        multiline={true}
                        returnKeyType='go'
                        onFocus={() => this.setState({
                            scanningQRCode: false
                        })}
                        onEndEditing={(text) => this.onSubmitPhrase(text)}/>

                    <View style={styles.separator_container}>
                        <View style={styles.dash}/>
                        <Text style={styles.separator_text}>OR BETTER YET</Text>
                        <View style={styles.dash}/>
                    </View>

                    <View>
                        <SvgUri width={200}
                                height={200}
                                source={require('../../res/icons/ic_scan_area.svg')}/>
                        {
                            this.state.scanningQRCode &&
                            <RNCamera style={{width: 180, height: 180, position: 'absolute', top: 10, left: 10}}/>
                        }
                    </View>

                    <TouchableOpacity
                        style={{marginBottom: 30}}
                        onPress={() => this.setState({
                            scanningQRCode: !this.state.scanningQRCode
                        })}>
                        <Text style={styles.scan_text_button}>Scan QR Code</Text>
                    </TouchableOpacity>
                </ScrollView>

                <Button title='Back'
                        style={StyleSheet.value('$back_button')}
                        icon={require('../../res/icons/ic_arrow_left.svg')}
                        onPress={() => {
                            Actions.pop();
                        }}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor: '$screenBackground',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 30,
        paddingRight: 30
    },
    scroll_container: {
        width: '100%',
        flex: 1,
        marginTop: 20,
        marginBottom: '$screen_padding_bottom',
    },
    phrase_input: {
        width: '100%',
        minHeight: 90,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        textAlign: 'auto'
    },
    separator_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 30,
    },
    separator_text: {
        color: '$textTitleColor',
        fontSize: 12,
        fontFamily: '$primaryFontBold',
        margin: 10,
    },
    dash: {
        width: 42,
        height: 1,
        backgroundColor: '$disableColor',
        marginTop: 2
    },
    scan_text_button: {
        color: '$primaryColor',
        fontFamily: '$primaryFontBold',
        padding: 5
    }
});