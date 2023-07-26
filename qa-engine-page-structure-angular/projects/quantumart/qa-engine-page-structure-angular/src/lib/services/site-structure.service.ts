import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { WIDGET_PLATFORM_API_URL } from '../public-api';
import { SiteNodeDetails } from './site-node.service';
import { BaseUrlService } from './base-url.service';
import { RedirectService } from './redirect.service';

export interface SiteRedirect {
    nodeId?: number;
    url?: string;
}

export interface SiteStructureNode {
    id: number;
    alias: string;
    nodeType: string;
    children?: SiteStructureNode[];
}

export interface SiteStructure {
    root: SiteStructureNode;
    redirects?: Map<number, SiteRedirect>;
}

export interface SiteNodeApiModel {
    id: number;
    alias: string;
    nodeType: string;
    children?: SiteNodeApiModel[];
    details?: SiteNodeDetails;
}

@Injectable({
    providedIn: 'root'
})
export class SiteStructureService {
    private readonly siteStructure$: Observable<SiteStructure>;

    constructor(
        httpClient: HttpClient,
        baseUrlService: BaseUrlService,
        redirectService: RedirectService,
        @Inject(WIDGET_PLATFORM_API_URL) widgetPlatformApiUrl: string,
    ) {
        this.siteStructure$ = httpClient
            .get<SiteNodeApiModel>(`${widgetPlatformApiUrl}/Site/structure`, {
                params: new HttpParams({
                    fromObject: {
                        dnsName: new URL(baseUrlService.getBaseUrl()).host,
                        fields: ['Mode', 'RedirectTo', 'IsVisible', 'IndexOrder', 'Title']
                    }
                })
            })
            .pipe(
                map(root => ({ root, redirects: redirectService.buildRedirectsMap(root) })),
                shareReplay(1)
            );
    }

    public getSiteStructure(): Observable<SiteStructure> {
        return this.siteStructure$;
    }
}
