import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { WINDOW } from '../public-api';

@Injectable({
    providedIn: 'root',
})
export class RedirectPageGuard {
    constructor(@Inject(WINDOW) private readonly windowRef: Window) {
    }

    public canActivate(route: ActivatedRouteSnapshot): boolean {
        const targetUrl = route.data['redirectTo'] as string;
        this.windowRef.location.assign(targetUrl);

        return false;
    }
}
