import { Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Breakpoint, GridBreakpointService } from '@zalari/ngx-grid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  currentBreakpoint: Observable<Breakpoint>;

  constructor(private _gridBreakpointService: GridBreakpointService) {}

  ngOnInit() {
    // s. https://github.com/angular/angular/issues/12129#issuecomment-252095727
    this.currentBreakpoint = this._gridBreakpointService.currentBreakpoint;
  }

}
