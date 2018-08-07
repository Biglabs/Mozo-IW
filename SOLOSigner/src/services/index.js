import CachingService from './CachingService';
import DataService from './DataService';
import GlobalService from './GlobalService';
import LinkingService from './LinkingService';
import RESTService from './RESTService';
import SignService from './SignService';
import WalletService from './WalletService';
import WalletBackupService from './WalletBackupService';

/**
 * expose to outside
 */
module.exports = {
    CachingService: CachingService,
    DataService: DataService,
    GlobalService: GlobalService,
    LinkingService: LinkingService,
    RESTService: RESTService,
    SignService: SignService,
    WalletService: WalletService,
    WalletBackupService: WalletBackupService,
};
