
import React from 'react';
import { Platform } from 'react-native';
import SvgUri from 'react-native-svg-uri';

// use for display svg on web
import SVGInline from "react-svg-inline";

const SoloSVG = ({ width, height, svg, fill = '', style = {} }) => {
    if (Platform.OS.toUpperCase() === "WEB") {
        return (
            <SVGInline 
                width = {width.toString()}
                height = {height.toString()}
                svg = {svg}
                fill = {fill.toString()}
                style = {style}
            />
        );    
    } else {
        return (
            <SvgUri 
                width = {width} 
                height = {height} 
                svgXmlData = {svg}
                fill = {fill}
                style = {style}
            />
        ); 
    }
}

export default SoloSVG;