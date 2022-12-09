import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WidgetDetails } from '@quantumart/qa-engine-page-structure-angular';

export interface TopMenuWidgetDetails extends WidgetDetails {
    title: string;
}

@Component({
    selector: 'qa-top-menu-widget',
    templateUrl: './top-menu-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenuWidgetComponent {
    @Input() public widget!: TopMenuWidgetDetails;
}
