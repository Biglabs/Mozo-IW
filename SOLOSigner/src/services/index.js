import { isWebPlatform } from "../helpers/PlatformUtils.js";

let manageWalletService;

/** 
 * Load services base on running platform
*/
(function initGameIIFE() {
    if(isWebPlatform()){
        const { manageWalletWeb } = require("./WalletService.web");
        manageWalletService = manageWalletWeb;
    } else {
        const { manageWallet } = require("./WalletService");
        manageWalletService = manageWallet;
    }
    
}());

/**
 * expose to outside
 */
module.exports = {
    manageWallet: manageWalletService
};
