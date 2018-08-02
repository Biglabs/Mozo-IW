import DataService from '../services/DataService';

/**
 * Insert wallet info to local DB.
 * @param {WalletInfo} walletInfo 
 */
export function saveWalletInfo(walletInfo) {
    return new Promise((resolve, reject) => {
        try {
            let service = DataService.getInstance().constructor;
            let wallet = getWalletInfo();
            service.realm.write(() => {
                // Fix issue: Local data is not cleared totally.
                if (wallet) {
                    service.realm.delete(wallet);
                }
                service.realm.create('Wallet', walletInfo);
                resolve(true);
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Get current wallet info.
 */
export function getWalletInfo() {
    let wallets = DataService.getInstance().constructor.realm.objects('Wallet');
    if(wallets.length > 0) {
        return wallets[0];
    }
    return null;
}