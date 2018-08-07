import service from '../services/DataService';

// For mobile
var DataService = service.getInstance().constructor;

/**
 * Insert wallet info to local DB.
 * @param {WalletInfo} walletInfo 
 */
export function saveWalletInfo(walletInfo) {
    return new Promise((resolve, reject) => {
        try {
            let service = DataService;
            let wallet = getWalletInfo();
            service.localStorage.write(() => {
                // Fix issue: Local data is not cleared totally.
                if (wallet) {
                    service.localStorage.delete(wallet);
                }
                service.localStorage.create('Wallet', walletInfo);
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
    let wallets = DataService.localStorage.objects('Wallet');
    if(wallets && wallets.length > 0) {
        return wallets[0];
    }
    return null;
}