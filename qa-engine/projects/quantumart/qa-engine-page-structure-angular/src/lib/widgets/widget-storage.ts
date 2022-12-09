import { WidgetDescriptor } from './widgets.types';

export class WidgetStorage {
    private nodeId = 0;
    private path = '';

    private readonly widgets = new Map<string, WidgetDescriptor[]>();

    public get(nodeId: number, path: string, zone: string): WidgetDescriptor[] | undefined {
        if (nodeId !== this.nodeId || path !== this.path) {
            return undefined;
        }

        return this.widgets.get(zone);
    }

    public set(nodeId: number, path: string, zone: string, widgets: WidgetDescriptor[]): void {
        if (nodeId !== this.nodeId || path !== this.path) {
            this.widgets.clear();
            this.nodeId = nodeId;
            this.path = path;
        }

        this.widgets.set(zone, widgets);
    }
}
