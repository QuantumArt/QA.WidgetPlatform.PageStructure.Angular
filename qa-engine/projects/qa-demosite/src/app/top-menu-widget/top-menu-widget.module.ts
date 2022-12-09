import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QaEnginePageStructureModule } from '@quantumart/qa-engine-page-structure-angular';
import { TopMenuWidgetComponent } from './top-menu-widget.component';

@NgModule({
    imports: [CommonModule, QaEnginePageStructureModule],
    declarations: [TopMenuWidgetComponent],
    exports: [TopMenuWidgetComponent]
})
export class TopMenuWidgetModule {
}
