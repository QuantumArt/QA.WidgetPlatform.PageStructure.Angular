import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipeModule } from '../common/pipes';
import { TextPageRoutingModule } from './text-page-routing.module';
import { TextPageComponent } from './text-page.component';
import { QaEnginePageStructureModule } from '@quantumart/qa-engine-page-structure-angular';

@NgModule({
    imports: [CommonModule, TextPageRoutingModule, QaEnginePageStructureModule, SafePipeModule],
    declarations: [TextPageComponent],
})
export class TextPageModule {
}
