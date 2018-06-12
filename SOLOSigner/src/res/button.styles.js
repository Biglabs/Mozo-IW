const common = {
    borderRadius: '$buttonRadius',
    color: '#ffffff',
    fontFamily: '$primaryFont',
    fontSize: 16,
    paddingLeft: 20,
    paddingTop: 12,
    paddingRight: 20,
    paddingBottom: 14,
    textAlign: 'center',
};

const SolidStyle = {
    ...common,
    backgroundColor: '$primaryColor',
    overflow: 'hidden'
};

const BaseBorderStyle = {
    borderRadius: '$buttonRadius',
    borderColor: '#cdcdcd',
    borderWidth: 1,
};

const BorderGrayStyle = {
    ...common,
    ...BaseBorderStyle,
    color: '#666666',
};

const BorderPrimaryStyle = {
    ...common,
    color: '$primaryColor',
    borderColor: '$primaryColor',
    borderWidth: 1,
    fontFamily: '$primaryFontBold',
    fontSize: 14,
};

export {
    BaseBorderStyle,
    SolidStyle,
    BorderGrayStyle,
    BorderPrimaryStyle
}