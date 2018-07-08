import {action, observable} from "mobx";
import Constant from '../Constants';
import {AsyncStorage} from "react-native";

export default class BackupWalletStateStore {
    @observable
    backupWalletState = -1;

    constructor() {
        AsyncStorage.getItem(Constant.FLAG_BACKUP_WALLET, (error, result) => {
            this.setBackupWalletState(result && (result === 'true'));
        });
    }

    @action
    setBackupWalletState(isBackup: boolean) {
        this.backupWalletState = isBackup ? 1 : 0;
    }
}