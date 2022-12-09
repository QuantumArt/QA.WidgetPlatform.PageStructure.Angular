﻿import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { WINDOW } from '../public-api';
import { isAbsoluteUrl } from '../../../../quantumart/qa-engine-page-structure-angular/src/lib/utils';

@Injectable({
    providedIn: 'root',
})
export class RedirectPageGuard implements CanActivate {
    constructor(@Inject(WINDOW) private readonly windowRef: Window) {
    }

    public canActivate(route: ActivatedRouteSnapshot): boolean {
        const targetUrl = route.data['redirectTo'] as string;
        this.windowRef.location.assign(targetUrl);

        return false;
    }
}
