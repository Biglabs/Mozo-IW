import {Dimensions, Platform} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const primaryColor = '#006DFF';
const textTitleColor = '#141a22';
const textContentColor = '#747474';
const errorColor = '#f05454';

const fontRegular = Platform.select({ios: 'UTM Avo', android: 'utm-avo'});
const fontBold = Platform.select({ios: 'UTMAvoBold', android: 'utm-avo-bold'});

let {width} = Dimensions.get('window');
const titleTextSize = width / 375 * Platform.select({ios: 30, android: 28});

EStyleSheet.build({
    $primaryFont: fontRegular,
    $primaryFontBold: fontBold,

    $primaryColor: primaryColor,
    $textTitleColor: textTitleColor,
    $textContentColor: textContentColor,
    $borderColor: '#cdcdcd',
    $screenBackground: '#FFFFFF',
    $disableColor: '#d1d7dd',
    $errorColor: errorColor,

    $screen_padding_bottom: 70,
    $screen_padding_horizontal: 30,
    $buttonRadius: 5,

    $screen_title_text: {
        color: primaryColor,
        fontSize: titleTextSize,
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
    $warning_text: {
        color: errorColor,
        fontFamily: fontBold,
        fontSize: 14
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