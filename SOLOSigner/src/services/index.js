import {Platform} from "react-native";
import { isWebPlatform } from "../helpers/PlatformUtils.js";

let walletService, walletBackupService, manageWalletService;

/** 
 * Load services base on running platform
*/
(function initServices() {
    if(isWebPlatform()){
        // require("./WalletService.web");
        walletService = require("./WalletService.web");
        walletBackupService = require("./WalletBackupService.web");
    } else {
        //require("./WalletService");
        walletService = require("./WalletService");
        walletBackupService = require("./WalletBackupService");

    }
    
}());

/**
 * expose to outside
 */
module.exports = {
    //manageWallet: walletService.manageWallet,
    //viewBackupPhrase: walletService.viewBackupPhrase,
    walletService: walletService,
    walletBackupService: walletBackupService,
    manageWallet: walletService.manageWallet // TODO: EDIT create wallet using new way
};
