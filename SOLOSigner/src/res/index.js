import {Dimensions, Platform} from 'react-native';
import icons from './icons';

const {width} = Dimensions.get('window');

const styles = {
    fontRegular: Platform.select({ios: 'UTM Avo', android: 'utm-avo'}),
    fontBold: Platform.select({ios: 'UTMAvoBold', android: 'utm-avo-bold'}),

    colorPrimary: '#006DFF',
    colorBorder: '#cdcdcd',
    colorDisable: '#d1d7dd',
    colorError: '#f05454',
    colorTitleText: '#141a22',
    colorContentText: '#747474',
    colorScreenBackground: '#FFFFFF',

    dimenCornerRadius: 5,
    dimenScreenWidth: width,
    dimenScreenPaddingTop: 40,
    dimenScreenPaddingBottom: 70,
    dimenScreenPaddingHorizontal: 30,
    dimenTitleTextSize: width / 375 * Platform.select({ios: 30, android: 28}),
};

const styleButtonCommon = {
    borderRadius: styles.dimenCornerRadius,
    color: '#ffffff',
    fontFamily: styles.fontRegular,
    fontSize: 16,
    paddingLeft: 20,
    paddingTop: 12,
    paddingRight: 20,
    paddingBottom: 14,
    textAlign: 'center',
};

const styleButtonBorderBase = {
    borderRadius: styles.dimenCornerRadius,
    borderColor: styles.colorBorder,
    borderWidth: 1,
};

styles.buttons = {
    SolidStyle: {
        ...styleButtonCommon,
        backgroundColor: styles.colorPrimary,
        overflow: 'hidden'
    },
    BaseBorderStyle: {
        ...styleButtonBorderBase,
    },
    BorderGrayStyle: {
        ...styleButtonCommon,
        ...styleButtonBorderBase,
        color: '#666666',
    },
    BorderPrimaryStyle: {
        ...styleButtonCommon,
        ...styleButtonBorderBase,
        color: styles.colorPrimary,
        borderColor: styles.colorPrimary,
        fontFamily: styles.fontBold,
        fontSize: 14,
    }
};
styles.styleScreenTitleText = {
    color: styles.colorPrimary,
    fontSize: styles.dimenTitleTextSize,
    marginTop: 53,
    marginBottom: 23,
};
styles.styleScreenSubTitleText = {
    color: styles.colorTitleText,
    fontFamily: styles.fontBold,
    fontSize: 12
};
styles.styleScreenExplainText = {
    color: styles.colorContentText,
    fontFamily: styles.fontRegular,
    fontSize: 12
};
styles.styleWarningText = {
    color: styles.colorError,
    fontFamily: styles.fontBold,
    fontSize: 14
};
styles.styleButtonBack = {
    position: 'absolute',
    bottom: 0,
};
styles.styleButtonContinue = {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'flex-end',
};
styles.icons = icons;

module.exports = styles;