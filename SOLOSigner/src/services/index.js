import {Platform} from "react-native";

import { isWebPlatform } from "../helpers/PlatformUtils.js";
import WalletBackupService from './WalletBackupService';

let walletService, manageWalletService;

/** 
 * Load services base on running platform
*/
(function initServices() {
    if(isWebPlatform()){
        // require("./WalletService.web");
        walletService = require("./WalletService.web");
    } else {
        //require("./WalletService");
        walletService = require("./WalletService");
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
    manageWallet: walletService.manageWallet // TODO: EDIT create wallet using new way
};
