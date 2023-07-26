import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { WidgetDescriptor, WidgetService } from '../../widgets';

@Injectable({
    providedIn: 'root',
})
export class LayoutWidgetsResolver {
    constructor(private readonly widgetService: WidgetService) {
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WidgetDescriptor[]> {
        const id = route.data['nodeId'] as number;
        return id ? this.widgetService.getLayoutWidgets(id, state.url) : of([]);
    }
}
