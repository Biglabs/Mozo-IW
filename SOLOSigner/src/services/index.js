import {Platform} from "react-native";
import { isWebPlatform } from "../helpers/PlatformUtils.js";

let walletService, walletBackupService, manageWalletService, dataService;

/** 
 * Load services base on running platform
*/
(function initServices() {
    if(isWebPlatform()){
        // require("./WalletService.web");
        // walletService = require("./WalletService.web");
        walletBackupService = require("./WalletBackupService.web");
        dataService = require("./DataService.web");
    } else {
        //require("./WalletService");
        walletService = require("./WalletService");
        walletBackupService = require("./WalletBackupService");
        dataService = require("./DataService.js");
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
   manageWallet: walletService.manageWallet, // TODO: EDIT create wallet using new way
    DataService: dataService
};
