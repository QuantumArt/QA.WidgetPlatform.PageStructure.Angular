import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LAYOUT_WIDGET_ZONES } from '../public-api';
import { SiteNodeService } from '../services';
import { WidgetDescriptor, WidgetDetails, WidgetsDetailsMap } from './widgets.types';
import { WidgetComponentResolver } from './widget-component.resolver';
import { WidgetStorage } from './widget-storage';

@Injectable({
    providedIn: 'root',
})
export class WidgetService {
    private readonly widgetStorage = new WidgetStorage();

    constructor(
        private readonly pageService: SiteNodeService,
        private readonly widgetComponentResolver: WidgetComponentResolver,
        @Inject(LAYOUT_WIDGET_ZONES) private readonly layoutWidgetZones: string[]
    ) {
    }

    public getWidgets(nodeId: number, path: string, zones: string[]): Observable<WidgetDescriptor[]> {
        const widgetLoaders: Observable<WidgetDescriptor[]>[] = [];
        const notLoadedZones = [];

        for (const zone of zones) {
            const zoneWidgets = this.widgetStorage.get(nodeId, path, zone);
            if (zoneWidgets != undefined) {
                widgetLoaders.push(of(zoneWidgets));
            } else {
                notLoadedZones.push(zone);
            }
        }

        if (notLoadedZones.length) {
            widgetLoaders.push(this.loadWidgets(nodeId, path, notLoadedZones));
        }

        return widgetLoaders && widgetLoaders.length
            ? forkJoin(widgetLoaders).pipe(
                map(widgetsInZones =>
                    widgetsInZones.reduce((result, next) => {
                        result.push(...next);

                        return result;
                    }, []),
                ),
            )
            : of([]);
    }

    public getLayoutWidgets(nodeId: number, path: string): Observable<WidgetDescriptor[]> {
        return this.getWidgets(nodeId, path, this.layoutWidgetZones);
    }

    private loadWidgets(nodeId: number, path: string, zones: string[]): Observable<WidgetDescriptor[]> {
        return this.pageService
            .getWidgets(nodeId, path, zones)
            .pipe(map(widgetsMap => this.createWidgets(nodeId, path, zones, widgetsMap)));
    }

    private createWidgets(
        nodeId: number,
        path: string,
        zones: readonly string[],
        widgetsMap: WidgetsDetailsMap,
    ): WidgetDescriptor[] {
        const allZonesWidgets: WidgetDescriptor[] = [];

        for (const zone of zones) {
            const zoneWidgets = this.createZoneWidgets(widgetsMap[zone] ?? []);
            this.widgetStorage.set(nodeId, path, zone, zoneWidgets);
            allZonesWidgets.push(...zoneWidgets);
        }

        return allZonesWidgets;
    }

    private createZoneWidgets(widgets: WidgetDetails[]): WidgetDescriptor[] {
        const result = [];

        for (const widget of widgets) {
            const component = this.widgetComponentResolver.resolve(widget);
            if (component) {
                result.push({ widget, component });
            }
        }

        return result;
    }
}
