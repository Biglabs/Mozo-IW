import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { WalletSolo } from './wallet-solo.model';
import { WalletSoloService } from './wallet-solo.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-wallet-solo',
    templateUrl: './wallet-solo.component.html'
})
export class WalletSoloComponent implements OnInit, OnDestroy {
wallets: WalletSolo[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private walletService: WalletSoloService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.walletService.query().subscribe(
            (res: ResponseWrapper) => {
                this.wallets = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInWallets();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: WalletSolo) {
        return item.id;
    }
    registerChangeInWallets() {
        this.eventSubscriber = this.eventManager.subscribe('walletListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
