
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

/* export default class SoloSVG extends Component {

    setNativeProps = (nativeProps) => {
        //this._root.setNativeProps(nativeProps);
    }

    render() {
        if (Platform.OS.toUpperCase() === "WEB") {
            return (
                <SVGInline 
                    width={this.props.width.toString()}
                    height={this.props.height.toString()}
                    svg={this.props.svg}
                />
            );    
        } else {
            return (
                <SvgUri 
                    width={this.props.width} 
                    height={this.props.height} 
                    svgXmlData={this.props.svg}
                />
            ); 
        }
    }
} */