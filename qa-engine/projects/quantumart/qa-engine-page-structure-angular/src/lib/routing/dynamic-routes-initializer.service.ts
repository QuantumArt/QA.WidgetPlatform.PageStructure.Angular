import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { BaseUrlService, SiteStructureService } from '../services';
import { RoutingService } from './routing.service';
import { buildRoutes } from './routing.builder';

@Injectable({
    providedIn: 'root'
})
export class DynamicRoutesInitializer implements CanActivate {
    constructor(
        private readonly baseUrlService: BaseUrlService,
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
