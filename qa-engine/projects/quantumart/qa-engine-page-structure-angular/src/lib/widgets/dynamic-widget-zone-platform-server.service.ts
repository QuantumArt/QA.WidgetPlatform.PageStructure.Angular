import { Injectable, VERSION } from '@angular/core';
import { PlatformBrowserService } from 'ngx-dynamic-hooks';

@Injectable()
export class DynamicWidgetZonePlatformServerService extends PlatformBrowserService {
    public override getNgVersion(): number {
        return Number(VERSION.major);
    }
}
