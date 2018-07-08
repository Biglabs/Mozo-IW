import BackupWalletStateStore from "./BackupWalletStateStore";
import SelectedWalletsStore from "./SelectedWalletsStore";

export default {
    backupWalletStateStore: new BackupWalletStateStore(),
    selectedWalletsStore: new SelectedWalletsStore(),
};