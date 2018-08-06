import {Platform} from "react-native";
import { isWebPlatform } from "../helpers/PlatformUtils.js";
import WalletBackupService from './WalletBackupService';

let walletService, manageWalletService, dataService;

/** 
 * Load services base on running platform
*/
(function initServices() {
    if(isWebPlatform()){
        // require("./WalletService.web");
        // walletService = require("./WalletService.web");
        dataService = require("./DataService.web");
    } else {
        //require("./WalletService");
        walletService = require("./WalletService");
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
    walletBackupService: WalletBackupService,
    manageWallet: walletService.manageWallet, // TODO: EDIT create wallet using new way
    DataService: dataService
};
