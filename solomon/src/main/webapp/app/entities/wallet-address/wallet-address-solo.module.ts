import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SolomonSharedModule } from '../../shared';
import {
    WalletAddressSoloService,
    WalletAddressSoloPopupService,
    WalletAddressSoloComponent,
    WalletAddressSoloDetailComponent,
    WalletAddressSoloDialogComponent,
    WalletAddressSoloPopupComponent,
    WalletAddressSoloDeletePopupComponent,
    WalletAddressSoloDeleteDialogComponent,
    walletAddressRoute,
    walletAddressPopupRoute,
} from './';

const ENTITY_STATES = [
    ...walletAddressRoute,
    ...walletAddressPopupRoute,
];

@NgModule({
    imports: [
        SolomonSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        WalletAddressSoloComponent,
        WalletAddressSoloDetailComponent,
        WalletAddressSoloDialogComponent,
        WalletAddressSoloDeleteDialogComponent,
        WalletAddressSoloPopupComponent,
        WalletAddressSoloDeletePopupComponent,
    ],
    entryComponents: [
        WalletAddressSoloComponent,
        WalletAddressSoloDialogComponent,
        WalletAddressSoloPopupComponent,
        WalletAddressSoloDeleteDialogComponent,
        WalletAddressSoloDeletePopupComponent,
    ],
    providers: [
        WalletAddressSoloService,
        WalletAddressSoloPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SolomonWalletAddressSoloModule {}
