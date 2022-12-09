import { inject, InjectionToken, Type } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WidgetComponent } from './widgets';

export const WINDOW = new InjectionToken<(Window & typeof globalThis) | null>(
    'Window Token', {
        providedIn: 'root',
        factory: () => inject(DOCUMENT).defaultView,
    }
);

export const WIDGET_PLATFORM_API_URL = new InjectionToken<string>('Widget platform api url');

export const WIDGET_COMPONENT_MAPPING = new InjectionToken<Map<string, Type<WidgetComponent>>>(
    'Widget to component mapping'
);

export const LAYOUT_WIDGET_ZONES = new InjectionToken<string[]>('Layout widget zones');
