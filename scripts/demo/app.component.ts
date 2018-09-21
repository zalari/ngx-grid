import { Subscription } from 'rxjs';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { GridBreakpointService } from '@zalari/ngx-grid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  private _subscriptions = new Set<Subscription>();

  currentBreakpoint: string;

  constructor(private _gridBreakpointService: GridBreakpointService,
              private _changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    // s. https://github.com/angular/angular/issues/12129#issuecomment-252095727
    this._subscriptions.add(
      this._gridBreakpointService.currentBreakpoint.subscribe(breakpoint => {
        this.currentBreakpoint = breakpoint;
        this._changeDetector.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    // unsubscribe all
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
