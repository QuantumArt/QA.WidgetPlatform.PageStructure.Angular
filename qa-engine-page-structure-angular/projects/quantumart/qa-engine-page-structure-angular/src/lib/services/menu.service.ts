import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { trim } from '../utils';
import { SiteNodeApiModel, SiteRedirect, SiteStructureService } from './site-structure.service';

export interface MenuElement {
    id: number;
    alias: string;
    title?: string;
    href?: string;
    children?: MenuElement[];
}

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    constructor(
        private readonly router: Router,
        private readonly siteStructureService: SiteStructureService
    ) {
    }

    public buildMenu(deep: number): Observable<MenuElement> {
        return this.siteStructureService.getSiteStructure().pipe(
            map(({ root, redirects }) => this.buildRecursive(
                { ...root, alias: '' },
                '/',
                this.router.config,
                deep,
                redirects,
            ))
        );
    }

    private buildRecursive(
        { id, alias, details, children }: SiteNodeApiModel,
        parentHref: string,
        routes: Route[],
        deep: number,
        redirects?: Map<number, SiteRedirect>,
    ): MenuElement {
        const currentElementUrl = `${parentHref}${parentHref !== '/' ? '/' : ''}${alias}`;

        const menuElement: MenuElement = {
            id,
            alias,
            href: this.getElementHref(id, alias, currentElementUrl, routes, redirects),
            title: details ? details['title']?.value as string : undefined
        };

        if (children && deep >= 0) {
            menuElement.children = [];

            for (const child of children
                .filter(({ details }) => details && details['isvisible']?.value)
                .sort((a, b) => (a.details!['indexorder']?.value ?? 0) - (b.details!['indexorder']?.value ?? 0))) {
                menuElement.children.push(this.buildRecursive(child, currentElementUrl, routes, deep - 1, redirects));
            }
        }

        return menuElement;
    }

    private getElementHref(
        id: number,
        alias: string,
        currentElementUrl: string,
        routes: Route[],
        redirects?: Map<number, SiteRedirect>
    ): string {
        const targetUrl = this.walkInRedirects(id, routes, redirects);
        if (targetUrl) {
            return targetUrl;
        }

        return alias.includes('/') ? alias : currentElementUrl;
    }

    private walkInRedirects(
        id: number,
        routes: Route[],
        redirects?: Map<number, SiteRedirect>
    ): string | undefined {
        const redirect = redirects?.get(id);
        if (!redirect) {
            return undefined;
        }

        if (redirect.url) {
            const routingPath = trim(redirect.url, '/');
            const route = routes.find(({ path }) => path === routingPath);

            if (route?.redirectTo) {
                return route.redirectTo;
            }

            if (route?.data && route.data['redirectTo']) {
                return route.data['redirectTo'];
            }

            return redirect.url;
        }

        const route = routes.find(({ data }) => data && data['nodeId'] as number === redirect.nodeId);
        if (!route) {
            return undefined;
        }

        if (route.redirectTo) {
            return route.redirectTo;
        }

        if (route.data && route.data['redirectTo']) {
            return route.data['redirectTo'] as string;
        }

        return route.path;
    }
}
