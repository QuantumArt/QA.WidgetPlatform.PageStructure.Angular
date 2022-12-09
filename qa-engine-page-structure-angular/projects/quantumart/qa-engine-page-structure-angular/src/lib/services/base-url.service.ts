import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { WINDOW } from '../public-api';

@Injectable({
    providedIn: 'root'
})
export class BaseUrlService {
    constructor(
        @Inject(WINDOW) private readonly windowRef: Window,
        @Inject(PLATFORM_ID) private readonly platformId: Object,
    ) {
    }

    public getBaseUrl(): string {
        const { protocol, host } = this.windowRef.location;

        return `${protocol}//${host}`;
    }
}
