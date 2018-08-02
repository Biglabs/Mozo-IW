import {Platform} from "react-native";

let addressDAO, appDAO, walletDAO;

/** 
 * Load services base on running platform
*/
(function initServices() {
    addressDAO = require("./AddressDAO");
    appDAO = require("./AppDAO");
    walletDAO = require("./WalletDAO");
}());

/**
 * expose to outside
 */
module.exports = {
    addressDAO,
    appDAO,
    walletDAO
};