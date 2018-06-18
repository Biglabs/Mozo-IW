import React, {Component} from "react";
import {TouchableHighlight, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {FooterActions, Text} from "../components/SoloComponent";

const accentColor = '#00fffc';
const numbersPressedColor = '#003c8d';
const numberPad = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['CLR', 0, 'DEL']
];

export default class ImportWalletScreen extends Component {
    constructor(props) {
        super(props);
        this.pinCode = [null, 2, null, null];
        this.state = {pinIndex: -1};
    }

    keyPress(key) {
        if (key === 'CLR') {
            if (this.state.pinIndex === -1) return;

            this.pinCode[this.state.pinIndex] = null;
            this.setState({pinIndex: --this.state.pinIndex});
            return;

        } else if (key === 'DEL') {
            this.setState({pinIndex: -1}, () => {
                this.pinCode = [null, null, null, null];
            });
            return;
        }

        if (this.state.pinIndex >= 3) return;

        this.setState({pinIndex: ++this.state.pinIndex}, () => {
            this.pinCode[this.state.pinIndex] = key;
        });
    }

    render() {
        return (
            <View style={styles.container}>

                <Text style={[StyleSheet.value('$screen_title_text'), styles.title]}>Security Pin</Text>

                <Text style={styles.sub_title}>Create a new PIN</Text>

                <View style={styles.radio_container}>
                    <View style={styles.radios}>{
                        this.state.pinIndex >= 0 && <View style={styles.radios_checked}/>
                    }</View>
                    <View style={styles.radios}>{
                        this.state.pinIndex >= 1 && <View style={styles.radios_checked}/>
                    }</View>
                    <View style={styles.radios}>{
                        this.state.pinIndex >= 2 && <View style={styles.radios_checked}/>
                    }</View>
                    <View style={styles.radios}>{
                        this.state.pinIndex >= 3 && <View style={styles.radios_checked}/>
                    }</View>
                </View>

                <View style={styles.number_pad}>
                    {
                        numberPad.map((row, key) => {
                            return <View key={key} style={styles.numbers_row}>
                                {
                                    row.map(button => {
                                        return <TouchableHighlight
                                            key={button}
                                            style={styles.numbers_touch}
                                            onPress={() => this.keyPress(button)}
                                            underlayColor={numbersPressedColor}>

                                            <Text style={styles.numbers}>{button}</Text>

                                        </TouchableHighlight>
                                    })
                                }
                            </View>
                        })
                    }
                </View>

                <FooterActions
                    buttonsColor={{back: accentColor, continue: accentColor}}
                    onBackPress={() => Actions.pop()}
                    enabledContinue={this.state.pinIndex === 3}
                    onContinuePress={() => Actions.main_stack()}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor: '$primaryColor',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 30,
        paddingRight: 30
    },
    title: {
        width: '100%',
        textAlign: 'center',
        color: '$screenBackground'
    },
    sub_title: {
        width: '100%',
        textAlign: 'center',
        color: '$screenBackground',
        fontSize: 14
    },
    radio_container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 12,
    },
    radios: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        borderWidth: 1,
        borderColor: accentColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 5,
    },
    radios_checked: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: accentColor
    },
    number_pad: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '$screen_padding_bottom',
    },
    numbers_row: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 7,
        marginBottom: 7,
    },
    numbers_touch: {
        width: 66,
        height: 66,
        borderRadius: 33,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    numbers: {
        color: '#429ffd',
        fontSize: 23.8,
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
        paddingBottom: 2
    }
});