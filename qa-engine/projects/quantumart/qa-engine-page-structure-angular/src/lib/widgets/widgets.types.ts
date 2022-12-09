import { Type } from '@angular/core';

export interface WidgetComponent {
    widget: WidgetDetails;
}

export interface WidgetDescriptor {
    widget: WidgetDetails;
    component: Type<WidgetComponent>;
}

export interface NodeDetails {
    id: number;
    alias: string;
    nodeType: string;

    [name: string]: unknown;
}

export interface WidgetDetails extends NodeDetails {
    zone: string;
    title: string;
    widgetTitle?: string;
    orderOnPage?: number;
    allowedUrlPatterns: string[];
    deniedUrlPatterns: string[];
}

export type WidgetsDetailsMap = Record<string, WidgetDetails[] | undefined>;
