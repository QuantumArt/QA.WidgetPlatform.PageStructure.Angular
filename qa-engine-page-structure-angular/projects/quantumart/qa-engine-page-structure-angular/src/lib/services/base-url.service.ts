import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../public-api';

@Injectable({
    providedIn: 'root'
})
export class BaseUrlService {
    constructor(@Inject(WINDOW) private readonly windowRef: Window) {
    }

    public getBaseUrl(): string {
        const { protocol, host } = this.windowRef.location;

        return `${protocol}//${host}`;
    }
}
