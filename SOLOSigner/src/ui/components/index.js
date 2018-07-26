import BackupWalletStateIcon from './views/BackupWalletStateIcon';
import CoinListItem from './views/CoinListItem';
import CreateWalletOptionItem from './views/CreateWalletOptionItem';
// import QRCodeScanner from './views/QRCodeScanner';
import ScreenFooterActions from './views/ScreenFooterActions';
import ScreenHeaderActions from './views/ScreenHeaderActions';
import AnimatedView from './widgets/AnimatedView';
import SoloButton from './widgets/SoloButton';
import SelectionGroup from './widgets/SelectionGroup';
import SoloText from './widgets/SoloText';
import SoloTextInput from './widgets/SoloTextInput';

// noinspection JSUnusedGlobalSymbols
module.exports = {
    /* views */
    BackupWalletStateIcon: BackupWalletStateIcon,
    CoinItemView: CoinListItem,
    CreateWalletOptionItem: CreateWalletOptionItem,
    // QRCodeScanner: QRCodeScanner,
    ScreenFooterActions: ScreenFooterActions,
    ScreenHeaderActions: ScreenHeaderActions,
    /* widgets */
    AnimatedView: AnimatedView,
    SelectionGroup: SelectionGroup,
    Button: SoloButton,
    Text: SoloText,
    TextInput: SoloTextInput,
};