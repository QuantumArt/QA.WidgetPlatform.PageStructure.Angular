import { Injectable } from '@angular/core';
import { HookBindings, HookComponentData, HookFinder, HookParser, HookPosition, HookValue } from 'ngx-dynamic-hooks';
import { WidgetDetails } from './widgets.types';

@Injectable({
    providedIn: 'root',
})
export class DynamicWidgetZoneHookParser implements HookParser {
    constructor(private readonly hookFinder: HookFinder) {
    }

    public findHooks(content: string): HookPosition[] {
        return this.hookFinder.findStandaloneHooks(content, /\[\[zone=(\w+)]]/gi);
    }

    public getBindings(hookId: number, hookValue: HookValue, context: WidgetDetails): HookBindings {
        const zoneStartIndex = hookValue.openingTag.indexOf('zone=');
        if (zoneStartIndex === -1) {
            throw new Error(`Missing zone name in '${hookValue.openingTag}'`);
        }

        const zone = hookValue.openingTag.substring(zoneStartIndex + 5, hookValue.openingTag.length - 2);

        return {
            inputs: {
                zone,
                nodeId: context.id,
            },
        };
    }

    public loadComponent(): HookComponentData {
        return {
            component: {
                importPromise: () => import('./widget-zone/widget-zone.component'),
                importName: 'WidgetZoneComponent',
            },
        };
    }
}
