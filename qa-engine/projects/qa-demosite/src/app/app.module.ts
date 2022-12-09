import { APP_INITIALIZER, NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import {
    QaEnginePageStructureModule,
    SiteStructureService,
    WidgetComponent
} from '@quantumart/qa-engine-page-structure-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RedirectPageModule } from './redirect-page';
import { StartPageModule } from './start-page';
import { TextPageModule } from './text-page';
import { NewsPageModule } from './news-page';
import { MediaPageModule } from './media-page';
import { SitemapPageModule } from './sitemap-page';
import { SearchPageModule } from './search-page';
import { HtmlWidgetModule, HtmlWidgetComponent } from './html-widget';
import { TopMenuWidgetModule, TopMenuWidgetComponent } from './top-menu-widget';
import { environment } from '../environments/environment';

function initializeAppFactory(siteStructureService: SiteStructureService): () => Observable<any> {
    return () => siteStructureService.getSiteStructure();
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HtmlWidgetModule,
        TopMenuWidgetModule,
        RedirectPageModule,
        StartPageModule,
        TextPageModule,
        NewsPageModule,
        MediaPageModule,
        SitemapPageModule,
        SearchPageModule,
        QaEnginePageStructureModule.forRoot({
            widgetPlatformApiUrl: environment.WIDGET_PLATFORM_API_URL,
            layoutWidgetZones: ['SiteHeaderZone', 'SiteFooterZone'],
            widgetMapping: new Map<string, Type<WidgetComponent>>([
                ['html_widget', HtmlWidgetComponent],
                ['top_menu_widget', TopMenuWidgetComponent]
            ]),
        }),
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeAppFactory,
            deps: [SiteStructureService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
