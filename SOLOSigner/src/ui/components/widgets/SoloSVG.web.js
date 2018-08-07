import React from 'react';
import SVGInline from "react-svg-inline";

export default ({width, height, svg, fill = '', style = {}}) => {
    if (fill && fill.length > 0) {
        return <SVGInline
            width={width.toString()}
            height={height.toString()}
            cleanup={true}
            svg={svg}
            style={style}
            fill={fill.toString()}
        />
    } else {
        return <SVGInline
            width={width.toString()}
            height={height.toString()}
            svg={svg}
            style={style}
            fill={fill.toString()}
        />
    }
}