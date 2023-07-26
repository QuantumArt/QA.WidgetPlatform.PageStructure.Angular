import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { SiteStructureService } from '../services';
import { buildRoutes } from './routing.builder';
import { RoutingService } from './routing.service';

@Injectable({
    providedIn: 'root'
})
export class DynamicRoutesInitializer {
    constructor(
        private readonly siteStructureService: SiteStructureService,
        private readonly routingService: RoutingService,
        private readonly router: Router,
    ) {
    }

    canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this.siteStructureService.getSiteStructure().pipe(
            filter(Boolean),
            tap(siteStructure => this.routingService.reinitialize(buildRoutes(siteStructure))),
            map(() => this.router.parseUrl(state.url)),
        );
    }
}
