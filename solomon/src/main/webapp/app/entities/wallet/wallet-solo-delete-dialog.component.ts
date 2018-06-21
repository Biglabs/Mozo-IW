import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { WalletSolo } from './wallet-solo.model';
import { WalletSoloPopupService } from './wallet-solo-popup.service';
import { WalletSoloService } from './wallet-solo.service';

@Component({
    selector: 'jhi-wallet-solo-delete-dialog',
    templateUrl: './wallet-solo-delete-dialog.component.html'
})
export class WalletSoloDeleteDialogComponent {

    wallet: WalletSolo;

    constructor(
        private walletService: WalletSoloService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.walletService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'walletListModification',
                content: 'Deleted an wallet'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-wallet-solo-delete-popup',
    template: ''
})
export class WalletSoloDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private walletPopupService: WalletSoloPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.walletPopupService
                .open(WalletSoloDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
