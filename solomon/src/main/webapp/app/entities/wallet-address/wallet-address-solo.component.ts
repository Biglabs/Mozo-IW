import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { WalletAddressSolo } from './wallet-address-solo.model';
import { WalletAddressSoloService } from './wallet-address-solo.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-wallet-address-solo',
    templateUrl: './wallet-address-solo.component.html'
})
export class WalletAddressSoloComponent implements OnInit, OnDestroy {
walletAddresses: WalletAddressSolo[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private walletAddressService: WalletAddressSoloService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.walletAddressService.query().subscribe(
            (res: ResponseWrapper) => {
                this.walletAddresses = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInWalletAddresses();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: WalletAddressSolo) {
        return item.id;
    }
    registerChangeInWalletAddresses() {
        this.eventSubscriber = this.eventManager.subscribe('walletAddressListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
