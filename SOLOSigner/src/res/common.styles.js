import {Platform} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const primaryColor = '#006DFF';
const textTitleColor = '#141a22';
const textContentColor = '#747474';

const fontRegular = Platform.OS === 'ios' ? 'UTM Avo' : 'utm-avo';
const fontBold = Platform.OS === 'ios' ? 'UTMAvoBold' : 'utm-avo-bold';

EStyleSheet.build({
    $primaryFont: fontRegular,
    $primaryFontBold: fontBold,

    $primaryColor: primaryColor,
    $textTitleColor: textTitleColor,
    $textContentColor: textContentColor,
    $screenBackground: '#FFFFFF',
    $disableColor: '#d1d7dd',

    $screen_padding_bottom: 70,
    $buttonRadius: 5,

    $screen_title_text: {
        color: primaryColor,
        fontSize: 30,
        marginTop: 53,
        marginBottom: 23,
    },
    $screen_sub_title_text: {
        color: textTitleColor,
        fontFamily: fontBold,
        fontSize: 12
    },
    $screen_explain_text: {
        color: textContentColor,
        fontFamily: fontRegular,
        fontSize: 12
    },
    $back_button: {
        position: 'absolute',
        bottom: 0,
    },
    $continue_button: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'flex-end',
    },
});