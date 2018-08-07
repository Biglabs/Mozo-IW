import CachingService from './CachingService';
import DataService from './DataService';
import GlobalService from './GlobalService';
import LinkingService from './LinkingService';
import RESTService from './RESTService';
// import SignService from './SignService';
import WalletService from './WalletService';
import WalletBackupService from './backup/WalletBackupService';

/**
 * expose to outside
 */
module.exports = {
    CachingService: CachingService,
    DataService: DataService,
    GlobalService: GlobalService,
    LinkingService: LinkingService,
    RESTService: RESTService,
    // TODO: MUST fix issue Can't resolve (Desktop)
    // SignService: SignService,
    WalletService: WalletService,
    WalletBackupService: WalletBackupService,
};
