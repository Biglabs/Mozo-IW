import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { WalletSolo } from './wallet-solo.model';
import { WalletSoloPopupService } from './wallet-solo-popup.service';
import { WalletSoloService } from './wallet-solo.service';

@Component({
    selector: 'jhi-wallet-solo-dialog',
    templateUrl: './wallet-solo-dialog.component.html'
})
export class WalletSoloDialogComponent implements OnInit {

    wallet: WalletSolo;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private walletService: WalletSoloService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.wallet.id !== undefined) {
            this.subscribeToSaveResponse(
                this.walletService.update(this.wallet));
        } else {
            this.subscribeToSaveResponse(
                this.walletService.create(this.wallet));
        }
    }

    private subscribeToSaveResponse(result: Observable<WalletSolo>) {
        result.subscribe((res: WalletSolo) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: WalletSolo) {
        this.eventManager.broadcast({ name: 'walletListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-wallet-solo-popup',
    template: ''
})
export class WalletSoloPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private walletPopupService: WalletSoloPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.walletPopupService
                    .open(WalletSoloDialogComponent as Component, params['id']);
            } else {
                this.walletPopupService
                    .open(WalletSoloDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
