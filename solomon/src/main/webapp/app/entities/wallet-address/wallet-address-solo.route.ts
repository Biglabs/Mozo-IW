import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { WalletAddressSoloComponent } from './wallet-address-solo.component';
import { WalletAddressSoloDetailComponent } from './wallet-address-solo-detail.component';
import { WalletAddressSoloPopupComponent } from './wallet-address-solo-dialog.component';
import { WalletAddressSoloDeletePopupComponent } from './wallet-address-solo-delete-dialog.component';

export const walletAddressRoute: Routes = [
    {
        path: 'wallet-address-solo',
        component: WalletAddressSoloComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.walletAddress.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'wallet-address-solo/:id',
        component: WalletAddressSoloDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.walletAddress.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const walletAddressPopupRoute: Routes = [
    {
        path: 'wallet-address-solo-new',
        component: WalletAddressSoloPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.walletAddress.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'wallet-address-solo/:id/edit',
        component: WalletAddressSoloPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.walletAddress.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'wallet-address-solo/:id/delete',
        component: WalletAddressSoloDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.walletAddress.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
