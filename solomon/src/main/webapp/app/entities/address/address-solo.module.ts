import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SolomonSharedModule } from '../../shared';
import {
    AddressSoloService,
    AddressSoloPopupService,
    AddressSoloComponent,
    AddressSoloDetailComponent,
    AddressSoloDialogComponent,
    AddressSoloPopupComponent,
    AddressSoloDeletePopupComponent,
    AddressSoloDeleteDialogComponent,
    addressRoute,
    addressPopupRoute,
} from './';

const ENTITY_STATES = [
    ...addressRoute,
    ...addressPopupRoute,
];

@NgModule({
    imports: [
        SolomonSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        AddressSoloComponent,
        AddressSoloDetailComponent,
        AddressSoloDialogComponent,
        AddressSoloDeleteDialogComponent,
        AddressSoloPopupComponent,
        AddressSoloDeletePopupComponent,
    ],
    entryComponents: [
        AddressSoloComponent,
        AddressSoloDialogComponent,
        AddressSoloPopupComponent,
        AddressSoloDeleteDialogComponent,
        AddressSoloDeletePopupComponent,
    ],
    providers: [
        AddressSoloService,
        AddressSoloPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SolomonAddressSoloModule {}
