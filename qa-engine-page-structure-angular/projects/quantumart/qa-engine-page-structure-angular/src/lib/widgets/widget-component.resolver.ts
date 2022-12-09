import { Inject, Injectable, Type } from '@angular/core';
import { WidgetComponent, WidgetDetails } from './widgets.types';
import { WIDGET_COMPONENT_MAPPING } from '../public-api';

@Injectable({
    providedIn: 'root',
})
export class WidgetComponentResolver {
    constructor(@Inject(WIDGET_COMPONENT_MAPPING) private readonly mapping: Map<string, Type<WidgetComponent>>) {
    }

    public resolve({ nodeType }: WidgetDetails): Type<WidgetComponent> | undefined {
        return this.mapping.get(nodeType);
    }
}
