import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { DestroyService } from '../../services';
import { WidgetComponent, WidgetDescriptor, WidgetDetails } from '../widgets.types';
import { WidgetService } from '../widget.service'
import { WidgetFilterService } from '../filters';
import { WidgetZoneHostDirective } from './widget-zone-host.directive';

@Component({
    selector: 'qa-widget-zone',
    templateUrl: './widget-zone.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DestroyService],
})
export class WidgetZoneComponent implements OnInit, OnDestroy {
    @Input()
    public set zone(value: string | string[]) {
        this.zones = Array.isArray(value) ? value : [value];
    }

    @Input()
    public set filters(value: string[] | undefined) {
        value?.forEach(filter => {
            if (!this.filterNames.includes(filter)) {
                this.filterNames.push(filter);
            }
        });
    }

    @Input() public nodeId!: number;

    @ViewChild(WidgetZoneHostDirective, { static: true })
    public readonly zoneHost!: WidgetZoneHostDirective;

    private get widgetsContainer(): ViewContainerRef {
        return this.zoneHost.viewContainerRef;
    }

    private readonly widgets: WidgetDetails[] = [];
    private readonly componentRefs = new Map<number, ComponentRef<WidgetComponent>>();
    private readonly filterNames: string[] = [];
    private zones: string[] = [];

    constructor(
        @Inject(DestroyService) private readonly ngUnsubscribe$: Observable<void>,
        private readonly widgetService: WidgetService,
        private readonly filterService: WidgetFilterService,
        private readonly router: Router,
        private readonly elementRef: ElementRef<Element>,
        private readonly cdr: ChangeDetectorRef,
    ) {
    }

    public ngOnInit(): void {
        of(this.nodeId)
            .pipe(
                filter(nodeId => nodeId > 0),
                switchMap(nodeId =>
                    this.widgetService
                        .getWidgets(nodeId, this.router.url, this.zones)
                        .pipe(switchMap(widgets => this.filterService.apply(this.filterNames, widgets))),
                ),
                takeUntil(this.ngUnsubscribe$),
            )
            .subscribe(widgets => this.createComponents(widgets));
    }

    public ngOnDestroy(): void {
        this.clearContainerWidgets();
    }

    private createComponents(widgets: WidgetDescriptor[]): void {
        this.clearContainerWidgets();

        for (const zone of this.zones) {
            widgets
                .filter(({ widget }) => widget.zone === zone)
                .forEach(({ component, widget }) => {
                    this.widgets.push(widget);
                    const componentRef = this.widgetsContainer.createComponent(component);
                    componentRef.instance.widget = widget;
                    this.componentRefs.set(widget.id, componentRef);
                });
        }

        this.cdr.detectChanges();
    }

    private clearContainerWidgets(): void {
        this.widgetsContainer.clear();
    }
}
