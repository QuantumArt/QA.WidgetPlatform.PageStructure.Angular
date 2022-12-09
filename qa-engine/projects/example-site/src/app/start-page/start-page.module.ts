import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartPageRoutingModule } from './start-page-routing.module';
import { StartPageComponent } from './start-page.component';
import { QaEnginePageStructureModule } from '@quantumart/qa-engine-page-structure-angular';

@NgModule({
    imports: [CommonModule, StartPageRoutingModule, QaEnginePageStructureModule],
    declarations: [StartPageComponent],
})
export class StartPageModule {
}
