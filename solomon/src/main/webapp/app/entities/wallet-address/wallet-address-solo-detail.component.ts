import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { WalletAddressSolo } from './wallet-address-solo.model';
import { WalletAddressSoloService } from './wallet-address-solo.service';

@Component({
    selector: 'jhi-wallet-address-solo-detail',
    templateUrl: './wallet-address-solo-detail.component.html'
})
export class WalletAddressSoloDetailComponent implements OnInit, OnDestroy {

    walletAddress: WalletAddressSolo;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private walletAddressService: WalletAddressSoloService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInWalletAddresses();
    }

    load(id) {
        this.walletAddressService.find(id).subscribe((walletAddress) => {
            this.walletAddress = walletAddress;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInWalletAddresses() {
        this.eventSubscriber = this.eventManager.subscribe(
            'walletAddressListModification',
            (response) => this.load(this.walletAddress.id)
        );
    }
}
