import { Injectable } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found';

export interface RouteData {
    nodeId: number;
    nodeType: string;
    redirectTo?: string;
}

export interface RouteDescriptor {
    path?: string;
    pathMatch?: string;
    redirectTo?: string;
    data: RouteData;
}

@Injectable({
    providedIn: 'root',
})
export class RoutingService {
    constructor(private readonly router: Router) {
    }

    public find(nodeId: number): Route | undefined {
        return this.router.config.find(({ data }) => data && data['nodeId'] === nodeId);
    }

    public reinitialize(routeDescriptors: RouteDescriptor[]): void {
        if (!routeDescriptors?.length) {
            return;
        }
        this.router.resetConfig(this.buildRoutes(routeDescriptors));
    }

    private buildRoutes(routeDescriptors: RouteDescriptor[]): Routes {
        const pagesRoutes = this.createPagesRoutesMap();
        const routes = routeDescriptors.map(descriptor => this.createRoute(descriptor, pagesRoutes));
        routes.push({
            path: '**',
            component: NotFoundComponent
        });

        return routes;
    }

    private createRoute(routeDescriptor: RouteDescriptor, pagesRoutes: Map<string, Route>): Route {
        if (routeDescriptor.redirectTo) {
            return {
                ...routeDescriptor,
            };
        }

        let pageRoute = pagesRoutes.get(routeDescriptor.data.nodeType);
        if (!pageRoute) {
            pageRoute = pagesRoutes.get('legacy_page');
        }

        return {
            ...pageRoute,
            ...routeDescriptor,
        };
    }

    private createPagesRoutesMap(): Map<string, Route> {
        return new Map<string, Route>(
            this.router.config
                .filter(route => route.data && route.data['nodeType'])
                .map(route => {
                    return [route.data!['nodeType'], route];
                }),
        );
    }
}
