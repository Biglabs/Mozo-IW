import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SolomonWalletSoloModule } from './wallet/wallet-solo.module';
import { SolomonAddressSoloModule } from './address/address-solo.module';
import { SolomonWalletAddressSoloModule } from './wallet-address/wallet-address-solo.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        SolomonWalletSoloModule,
        SolomonAddressSoloModule,
        SolomonWalletAddressSoloModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SolomonEntityModule {}
