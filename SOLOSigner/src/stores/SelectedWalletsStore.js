import {observable, action} from "mobx";
import Constant from '../helpers/Constants';

export default class SelectedWalletsStore {
    @observable
    wallets = Constant.DEFAULT_COINS;

    @action
    updateWallets(wallets) {
        if (wallets) {
            this.wallets = wallets.sort(function (a, b) {
                return a.displayName.localeCompare(b.displayName);
            });
        }
    }
}