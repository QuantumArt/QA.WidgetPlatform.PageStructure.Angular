import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DynamicHooksModule } from 'ngx-dynamic-hooks';
import { LAYOUT_WIDGET_ZONES, WIDGET_COMPONENT_MAPPING, WIDGET_PLATFORM_API_URL, } from './public-api';
import { InitialRequestComponentModule, NotFoundComponentModule, RouterNavigationDirectiveModule } from './routing';
import {
    DynamicWidgetZoneHookParser,
    DynamicWidgetZonePlatformServerService,
    WidgetComponent,
    WidgetZoneModule
} from './widgets';

export interface QaEnginePageStructureModuleOptions {
    widgetPlatformApiUrl: string,
    widgetMapping?: Map<string, Type<WidgetComponent>>;
    layoutWidgetZones?: string[];
}

function buildWidgetMapping(source: Map<string, Type<WidgetComponent>> | undefined): Map<string, Type<WidgetComponent>> {
    const result = new Map<string, Type<WidgetComponent>>();

    if (source?.size) {
        for (const [key, widgetType] of source) {
            result.set(key, widgetType);
        }
    }

    return result;
}

@NgModule({
    declarations: [],
    imports: [
        DynamicHooksModule.forRoot(
            {
                globalParsers: [
                    DynamicWidgetZoneHookParser
                ],
            },
            DynamicWidgetZonePlatformServerService,
        ),
        HttpClientModule,
        RouterNavigationDirectiveModule,
        InitialRequestComponentModule,
        NotFoundComponentModule,
        WidgetZoneModule
    ],
    exports: [
        RouterNavigationDirectiveModule,
        InitialRequestComponentModule,
        NotFoundComponentModule,
        WidgetZoneModule
    ]
})
export class QaEnginePageStructureModule {
    static forRoot(config: QaEnginePageStructureModuleOptions): ModuleWithProviders<QaEnginePageStructureModule> {
        const layoutWidgetZones = [];
        if (config.layoutWidgetZones?.length) {
            layoutWidgetZones.push(...config.layoutWidgetZones);
        }

        return {
            ngModule: QaEnginePageStructureModule,
            providers: [
                {
                    provide: WIDGET_PLATFORM_API_URL,
                    useValue: config.widgetPlatformApiUrl
                },
                {
                    provide: WIDGET_COMPONENT_MAPPING,
                    useValue: buildWidgetMapping(config.widgetMapping)
                },
                {
                    provide: LAYOUT_WIDGET_ZONES,
                    useValue: layoutWidgetZones
                }
            ]
        };
    }
}
