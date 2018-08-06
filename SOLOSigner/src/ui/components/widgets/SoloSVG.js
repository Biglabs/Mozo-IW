import React from 'react';
import SvgUri from 'react-native-svg-uri';

export default ({width, height, svg, fill = '', style = {}}) => {
    return <SvgUri
        width={width}
        height={height}
        svgXmlData={svg}
        fill={fill}
        style={style}
    />
};