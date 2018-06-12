import {Platform} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const primaryColor = '#006DFF';
EStyleSheet.build({
    $primaryFont: Platform.OS === 'ios' ? 'UTM Avo' : 'utm-avo',
    $primaryFontBold: Platform.OS === 'ios' ? 'UTMAvoBold' : 'utm-avo-bold',

    $primaryColor: primaryColor,
    $screenBackground: '#FFFFFF',
    $textTitleColor: '#141a22',
    $textContentColor: '#747474',
    $disableColor: '#d1d7dd',

    $buttonRadius: 5,

    $screen_title_text: {
        color: primaryColor,
        fontSize: 30,
        marginTop: 53,
        marginBottom: 23,
    },
});