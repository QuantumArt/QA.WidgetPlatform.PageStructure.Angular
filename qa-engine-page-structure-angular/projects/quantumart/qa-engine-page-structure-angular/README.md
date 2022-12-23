**@quantumart/qa-engine-page-structure-angular**

Данная библиотека предоставляет набор инструментов для построения фронтенда для сайта на базе QP (Angular версия).

**Demo site**
* [Исходники](https://tfs.dev.qsupport.ru/tfs/QuantumartCollection/QA.Core/_git/QA.Engine.Demosite)
* [Площадка](http://demositerus.dev.qsupport.ru/)
* [QP](https://qp.dev.qsupport.ru/) (customer code: qa_demosite_rus)

**Описание**

Необходимый бэкенд для построения сайта:
* База данных на основе qp
* API на .NET Core с методом получения структуры сайта (дерево UniversalAbstractItem)
 
**Установка**
           
Установить npm пакет:

```npm install @quantumart/qa-engine-page-structure-angular```

**Пример подключения**

Импортировать модуль QaEnginePageStructureModule в основном модуле angular-приложения:
```typescript
...
import { QaEnginePageStructureModule, WidgetComponent } from '@quantumart/qa-engine-page-structure-angular';

@NgModule({
  ...  
  imports: [
    ...
    QaEnginePageStructureModule.forRoot({
      widgetPlatformApiUrl: environment.WIDGET_PLATFORM_API_URL,
      layoutWidgetZones: ['SiteHeaderZone', 'SiteFooterZone'],
      widgetMapping: new Map<string, Type<WidgetComponent>>([
        ['html_widget', HtmlWidgetComponent],
        ['banner_widget', BannerWidgetComponent],
        ['feedback_widget', FeedbackWidgetComponent],
        ...
      ]),
    }), 
    ...  
  ],
  ...
```
* widgetPlatformApiUrl - базовый URL API виджетной платформы
* layoutWidgetZones - список виджетных зон, размещенных в шаблоне
* widgetMapping - маппинг виджетов на angular-компоненты  

Определить angular-роуты:

```typescript
...
import {
    DynamicRoutesInitializer,
    InitialRequestComponent,
    LayoutWidgetsResolver,
    PageDetailsResolver
} from '@quantumart/qa-engine-page-structure-angular';

const routes: Routes = [
  {
    path: '**',
    component: InitialRequestComponent,
    canActivate: [DynamicRoutesInitializer],
  },
  {
    path: 'start-page',
    loadChildren: () => import('./start-page/start-page.module').then(m => m.StartPageModule),
    resolve: {
      details: PageDetailsResolver,
      staticWidgets: LayoutWidgetsResolver,
    },
    data: {
      nodeType: 'start_page',
    },
  },
  ...
];

``` 
Пример реализации компонента стартовой страницы: 

```typescript
import { NodeDetails } from '@quantumart/qa-engine-page-structure-angular';
import { SiteNodeComponent, SiteNodeService } from '../services';

export interface StartPageDetails extends NodeDetails {
  title: string;
}

@Component({
  selector: 'qa-start-page',
  templateUrl: './start-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPageComponent implements SiteNodeComponent {
  public get id(): number {
    return this.siteNodeService.getNodeId();
  }

  public readonly pageDetails$ = this.siteNodeService.getDetails<StartPageDetails>();

  constructor(private readonly siteNodeService: SiteNodeService) {
  }
}

```
Пример реализации компонента виджета:
```typescript
...
import { WidgetComponent, WidgetDetails } from '@quantumart/qa-engine-page-structure-angular';

export interface HtmlWidgetDetails extends WidgetDetails {
  html: string;
}

@Component({
  selector: 'qa-html-widget',
  templateUrl: './html-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlWidgetComponent implements WidgetComponent {
  @Input() public widget!: HtmlWidgetDetails;
}

```
