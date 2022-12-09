import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WidgetDetails } from '@quantumart/qa-engine-page-structure-angular';

export interface HtmlWidgetDetails extends WidgetDetails {
    html: string;
}

@Component({
    selector: 'qa-html-widget',
    templateUrl: './html-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlWidgetComponent {
    @Input()
    public set widget(value: HtmlWidgetDetails) {
        this.details = value;
    }

    public details!: HtmlWidgetDetails;
}
