import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Subject } from 'rxjs';

interface RouteOutletActivateEvent {
    activatedRoute?: ActivatedRoute;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    public title = 'example-site';
    public nodeId$ = new Subject<number>();

    private readonly activatedRoute$ = new Subject<ActivatedRouteSnapshot>();

    public updateCurrentNode(event: RouteOutletActivateEvent): void {
        if (event.activatedRoute) {
            const nodeId = event.activatedRoute.snapshot.data['nodeId'] as number;
            if (Boolean(nodeId)) {
                this.nodeId$.next(nodeId);
                this.activatedRoute$.next(event.activatedRoute.snapshot);
            }
        }
    }
}
