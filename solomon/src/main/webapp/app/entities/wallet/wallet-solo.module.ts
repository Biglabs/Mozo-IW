import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SolomonSharedModule } from '../../shared';
import {
    WalletSoloService,
    WalletSoloPopupService,
    WalletSoloComponent,
    WalletSoloDetailComponent,
    WalletSoloDialogComponent,
    WalletSoloPopupComponent,
    WalletSoloDeletePopupComponent,
    WalletSoloDeleteDialogComponent,
    walletRoute,
    walletPopupRoute,
} from './';

const ENTITY_STATES = [
    ...walletRoute,
    ...walletPopupRoute,
];

@NgModule({
    imports: [
        SolomonSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        WalletSoloComponent,
        WalletSoloDetailComponent,
        WalletSoloDialogComponent,
        WalletSoloDeleteDialogComponent,
        WalletSoloPopupComponent,
        WalletSoloDeletePopupComponent,
    ],
    entryComponents: [
        WalletSoloComponent,
        WalletSoloDialogComponent,
        WalletSoloPopupComponent,
        WalletSoloDeleteDialogComponent,
        WalletSoloDeletePopupComponent,
    ],
    providers: [
        WalletSoloService,
        WalletSoloPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SolomonWalletSoloModule {}
