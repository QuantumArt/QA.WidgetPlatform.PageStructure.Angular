import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MenuService, WidgetDetails } from '@quantumart/qa-engine-page-structure-angular';
import { map } from 'rxjs/operators';

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

  public items$ = this.menuService.buildMenu(3).pipe(map(({ children }) => children));

  constructor(private readonly menuService: MenuService) {
  }
}
