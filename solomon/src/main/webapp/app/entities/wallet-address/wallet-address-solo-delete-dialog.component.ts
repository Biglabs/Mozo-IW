import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { WalletAddressSolo } from './wallet-address-solo.model';
import { WalletAddressSoloPopupService } from './wallet-address-solo-popup.service';
import { WalletAddressSoloService } from './wallet-address-solo.service';

@Component({
    selector: 'jhi-wallet-address-solo-delete-dialog',
    templateUrl: './wallet-address-solo-delete-dialog.component.html'
})
export class WalletAddressSoloDeleteDialogComponent {

    walletAddress: WalletAddressSolo;

    constructor(
        private walletAddressService: WalletAddressSoloService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.walletAddressService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'walletAddressListModification',
                content: 'Deleted an walletAddress'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-wallet-address-solo-delete-popup',
    template: ''
})
export class WalletAddressSoloDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private walletAddressPopupService: WalletAddressSoloPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.walletAddressPopupService
                .open(WalletAddressSoloDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
