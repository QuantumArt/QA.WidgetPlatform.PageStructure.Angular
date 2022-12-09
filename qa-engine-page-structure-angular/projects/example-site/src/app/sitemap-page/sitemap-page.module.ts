import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitemapPageRoutingModule } from './sitemap-page-routing.module';
import { SitemapPageComponent } from './sitemap-page.component';
import { QaEnginePageStructureModule } from '@quantumart/qa-engine-page-structure-angular';

@NgModule({
    imports: [CommonModule, SitemapPageRoutingModule, QaEnginePageStructureModule],
    declarations: [SitemapPageComponent],
})
export class SitemapPageModule {
}
