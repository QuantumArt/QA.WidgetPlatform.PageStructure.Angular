import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import camelcase from 'camelcase';
import { WIDGET_PLATFORM_API_URL } from '../public-api';
import { NodeDetails, WidgetDetails, WidgetsDetailsMap } from '../widgets';
import { WidgetFilter } from './widget-filter.model';

interface SiteNodeDetailsValue {
    type: string;
    value: any;
}

export type SiteNodeDetails = Record<string, SiteNodeDetailsValue>;

interface SiteNodeDetailsApiModel {
    id: number;
    alias: string;
    nodeType: string;
    details: SiteNodeDetails;
}

export interface WidgetDetailsApiModel {
    id: number;
    alias: string;
    nodeType: string;
    zone: string;
    title: string;
    allowedUrlPatterns: string[];
    deniedUrlPatterns: string[];
    details: SiteNodeDetails;
    childWidgets: Record<string, WidgetDetailsApiModel>;
}

@Injectable({
    providedIn: 'root',
})
export class SiteNodeService {
    constructor(
        private readonly httpClient: HttpClient,
        @Inject(WIDGET_PLATFORM_API_URL) private readonly widgetPlatformApiUrl: string
    ) {
    }

    public getDetails(nodeId: number): Observable<NodeDetails> {
        return this.httpClient
            .get<SiteNodeDetailsApiModel>(`${this.widgetPlatformApiUrl}/Site/node/${nodeId}`)
            .pipe(map(model => this.createPageDetails(model)));
    }

    public getWidgets(nodeId: number, path: string, zones: string[]): Observable<WidgetsDetailsMap> {
        return this.httpClient
            .get<Record<string, WidgetDetailsApiModel[]>>(`${this.widgetPlatformApiUrl}/Site/widgets/${nodeId}`, {
                params: new HttpParams({
                    fromObject: {
                        zones
                    }
                })
            })
            .pipe(map(model => this.createWidgetsMap(model, path)));
    }

    private createPageDetails({ id, alias, nodeType, details }: SiteNodeDetailsApiModel): NodeDetails {
        const model: NodeDetails = { id, alias, nodeType };

        Object.keys(details).forEach(prop => (model[camelcase(prop)] = details[prop].value));

        return model;
    }

    private createWidgetsMap(
        widgetsData: Record<string, WidgetDetailsApiModel[]>,
        path: string,
    ): WidgetsDetailsMap {
        const widgetsMap: WidgetsDetailsMap = {};
        const widgetFilter = new WidgetFilter();

        Object.keys(widgetsData).forEach(zone => {
            widgetsMap[zone] = Array.isArray(widgetsData[zone])
                ? widgetsData[zone]
                    .filter(widgetData => widgetFilter.matchByPath(widgetData, path))
                    .map(widgetData => this.createWidgetDetails(widgetData))
                : [];
        });

        return widgetsMap;
    }

    private createWidgetDetails({
                                    id,
                                    alias,
                                    nodeType,
                                    zone,
                                    title,
                                    allowedUrlPatterns,
                                    deniedUrlPatterns,
                                    details,
                                }: WidgetDetailsApiModel): WidgetDetails {
        const model: WidgetDetails = {
            id,
            alias,
            nodeType,
            zone,
            title,
            allowedUrlPatterns,
            deniedUrlPatterns,
        };

        Object.keys(details).forEach(name => {
            model[camelcase(name)] = details[name].value;
        });

        return model;
    }
}
