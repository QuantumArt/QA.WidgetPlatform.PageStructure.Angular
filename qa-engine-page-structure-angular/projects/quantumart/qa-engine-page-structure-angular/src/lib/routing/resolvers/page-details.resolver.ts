import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SiteNodeService } from '../../services';
import { NodeDetails } from '../../widgets';

@Injectable({
    providedIn: 'root',
})
export class PageDetailsResolver {
    constructor(private readonly pageService: SiteNodeService) {
    }

    public resolve(route: ActivatedRouteSnapshot): Observable<NodeDetails> {
        const id = route.data['nodeId'] as number;
        const alias = route.data['alias'] as string;
        const nodeType = route.data['nodeType'] as string;

        return id
            ? this.pageService.getDetails(id)
            : of({
                id,
                alias,
                nodeType,
            });
    }
}
