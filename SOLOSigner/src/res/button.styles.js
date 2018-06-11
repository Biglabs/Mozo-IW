const common = {
    borderRadius: '$buttonRadius',
    color: '#ffffff',
    fontFamily: 'utm-avo',
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

const BorderGrayStyle = {
    ...common,
    color: '#666666',
    borderColor: '#cdcdcd',
    borderWidth: 1,
};

const BorderPrimaryStyle = {
    ...common,
    color: '$primaryColor',
    borderColor: '$primaryColor',
    borderWidth: 1,
    fontFamily: 'utm-avo-bold',
    fontSize: 14,
};

export {
    SolidStyle,
    BorderGrayStyle,
    BorderPrimaryStyle
}