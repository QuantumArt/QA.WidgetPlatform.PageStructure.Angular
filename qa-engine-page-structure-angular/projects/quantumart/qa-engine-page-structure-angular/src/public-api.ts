/*
 * Public API Surface of qa-engine-page-structure-angular
 */

export { QaEnginePageStructureModule } from './lib/qa-engine-page-structure.module';
export { SiteStructureService, MenuService, MenuElement } from './lib/services';

export {
    RouterNavigationDirectiveModule,
    RouterNavigationDirective,
    PageDetailsResolver,
    LayoutWidgetsResolver,
    DynamicRoutesInitializer,
    InitialRequestComponentModule,
    InitialRequestComponent,
    NotFoundComponentModule,
    NotFoundComponent
} from './lib/routing';

export {
    WidgetComponent,
    WidgetZoneModule,
    WidgetZoneComponent,
    NodeDetails,
    WidgetDetails,
} from './lib/widgets';
