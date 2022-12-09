import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetZoneComponent } from './widget-zone.component';
import { WidgetZoneHostDirective } from './widget-zone-host.directive';
import { SafePipeModule } from '../../pipes';

@NgModule({
    imports: [CommonModule, SafePipeModule],
    declarations: [WidgetZoneComponent, WidgetZoneHostDirective],
    exports: [WidgetZoneComponent],
})
export class WidgetZoneModule {
}
