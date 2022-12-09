import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[qaWidgetZoneHost]',
})
export class WidgetZoneHostDirective {
    constructor(public readonly viewContainerRef: ViewContainerRef) {
    }
}
