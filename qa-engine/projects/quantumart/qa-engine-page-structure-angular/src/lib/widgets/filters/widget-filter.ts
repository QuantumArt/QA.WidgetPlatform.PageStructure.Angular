import { Observable } from 'rxjs';
import { WidgetDescriptor } from '../widgets.types';

export interface WidgetFilter {
    apply(widgets: WidgetDescriptor[]): Observable<WidgetDescriptor[]>;
}
