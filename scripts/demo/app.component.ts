import { BehaviorSubject } from 'rxjs';

import { Component } from '@angular/core';
import { Breakpoint, GridBreakpointService } from '@zalari/ngx-grid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private _currentBreakpoint = new BehaviorSubject<Breakpoint>(Breakpoint.ExtraSmall);

  constructor(private _gridBreakpointService: GridBreakpointService) {
    this._registerListeners();
  }

  private _registerListeners() {
    Object
      .values(Breakpoint)
      .forEach((breakpoint: Breakpoint) => {
        this._gridBreakpointService.registerListener(breakpoint, (queryList) => this._activateBreakpoint(breakpoint, queryList));
      });
  }

  private _activateBreakpoint(breakpoint: Breakpoint, queryList: MediaQueryList) {
    console.log(breakpoint, queryList.matches);
  }

}
