import EStyleSheet from 'react-native-extended-stylesheet';

const primaryColor = '#006DFF';
EStyleSheet.build({
    $primaryColor: primaryColor,
    $screenBackground: '#FFFFFF',
    $textTitleColor: '#141a22',
    $textContentColor: '#747474',

    $buttonRadius: 5,

    $screen_title_text: {
        color: primaryColor,
        fontSize: 30,
        marginTop: 53,
        marginBottom: 23,
    },
});