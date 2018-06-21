import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { WalletSoloComponent } from './wallet-solo.component';
import { WalletSoloDetailComponent } from './wallet-solo-detail.component';
import { WalletSoloPopupComponent } from './wallet-solo-dialog.component';
import { WalletSoloDeletePopupComponent } from './wallet-solo-delete-dialog.component';

export const walletRoute: Routes = [
    {
        path: 'wallet-solo',
        component: WalletSoloComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.wallet.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'wallet-solo/:id',
        component: WalletSoloDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.wallet.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const walletPopupRoute: Routes = [
    {
        path: 'wallet-solo-new',
        component: WalletSoloPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.wallet.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'wallet-solo/:id/edit',
        component: WalletSoloPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.wallet.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'wallet-solo/:id/delete',
        component: WalletSoloDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.wallet.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
