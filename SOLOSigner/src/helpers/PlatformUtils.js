import { Platform } from "react-native";

function isWebPlatform() {
    return Platform.OS.toUpperCase === "WEB";
}

module.exports = {
    isWebPlatform : isWebPlatform
};