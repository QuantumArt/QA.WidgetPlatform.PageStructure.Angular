import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { WidgetFilter } from './widget-filter';
import { WidgetDescriptor } from '../widgets.types';

@Injectable({
    providedIn: 'root',
})
export class WidgetFilterService {
    private readonly filtersMap = new Map<string, WidgetFilter>([]);

    public apply(filters: string[], sourceWidgets: WidgetDescriptor[]): Observable<WidgetDescriptor[]> {
        if (!filters.length) {
            return of(sourceWidgets);
        }

        return filters.reduce(
            (result, filterName) =>
                this.filtersMap.has(filterName)
                    ? result.pipe(switchMap(widgets => this.filtersMap.get(filterName)!.apply(widgets)))
                    : result,
            of(sourceWidgets),
        );
    }
}
