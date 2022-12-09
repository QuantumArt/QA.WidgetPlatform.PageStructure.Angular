import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchPageComponent } from './search-page.component';
import { QaEnginePageStructureModule } from '@quantumart/qa-engine-page-structure-angular';

@NgModule({
    imports: [CommonModule, SearchPageRoutingModule, QaEnginePageStructureModule],
    declarations: [SearchPageComponent],
})
export class SearchPageModule {
}
