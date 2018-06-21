import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { AddressSoloComponent } from './address-solo.component';
import { AddressSoloDetailComponent } from './address-solo-detail.component';
import { AddressSoloPopupComponent } from './address-solo-dialog.component';
import { AddressSoloDeletePopupComponent } from './address-solo-delete-dialog.component';

export const addressRoute: Routes = [
    {
        path: 'address-solo',
        component: AddressSoloComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.address.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'address-solo/:id',
        component: AddressSoloDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.address.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const addressPopupRoute: Routes = [
    {
        path: 'address-solo-new',
        component: AddressSoloPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.address.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'address-solo/:id/edit',
        component: AddressSoloPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.address.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'address-solo/:id/delete',
        component: AddressSoloDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'solomonApp.address.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
