import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { WalletAddressSolo } from './wallet-address-solo.model';
import { WalletAddressSoloPopupService } from './wallet-address-solo-popup.service';
import { WalletAddressSoloService } from './wallet-address-solo.service';
import { AddressSolo, AddressSoloService } from '../address';
import { WalletSolo, WalletSoloService } from '../wallet';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-wallet-address-solo-dialog',
    templateUrl: './wallet-address-solo-dialog.component.html'
})
export class WalletAddressSoloDialogComponent implements OnInit {

    walletAddress: WalletAddressSolo;
    isSaving: boolean;

    addresses: AddressSolo[];

    wallets: WalletSolo[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private walletAddressService: WalletAddressSoloService,
        private addressService: AddressSoloService,
        private walletService: WalletSoloService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.addressService
            .query({filter: 'walletaddress-is-null'})
            .subscribe((res: ResponseWrapper) => {
                if (!this.walletAddress.address || !this.walletAddress.address.id) {
                    this.addresses = res.json;
                } else {
                    this.addressService
                        .find(this.walletAddress.address.id)
                        .subscribe((subRes: AddressSolo) => {
                            this.addresses = [subRes].concat(res.json);
                        }, (subRes: ResponseWrapper) => this.onError(subRes.json));
                }
            }, (res: ResponseWrapper) => this.onError(res.json));
        this.walletService.query()
            .subscribe((res: ResponseWrapper) => { this.wallets = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.walletAddress.id !== undefined) {
            this.subscribeToSaveResponse(
                this.walletAddressService.update(this.walletAddress));
        } else {
            this.subscribeToSaveResponse(
                this.walletAddressService.create(this.walletAddress));
        }
    }

    private subscribeToSaveResponse(result: Observable<WalletAddressSolo>) {
        result.subscribe((res: WalletAddressSolo) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: WalletAddressSolo) {
        this.eventManager.broadcast({ name: 'walletAddressListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackAddressById(index: number, item: AddressSolo) {
        return item.id;
    }

    trackWalletById(index: number, item: WalletSolo) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-wallet-address-solo-popup',
    template: ''
})
export class WalletAddressSoloPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private walletAddressPopupService: WalletAddressSoloPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.walletAddressPopupService
                    .open(WalletAddressSoloDialogComponent as Component, params['id']);
            } else {
                this.walletAddressPopupService
                    .open(WalletAddressSoloDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
