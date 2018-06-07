import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Injection tokens
import { GRID_BREAKPOINTS, gridBreakpoints } from './injection-tokens/grid-breakpoints.injection-token';
// Directives
import { GridDirective } from './directives/grid.directive';
import { GridItemDirective } from './directives/grid-item.directive';
// Services
import { GridBreakpointService } from './services/grid-breakpoint.service';
// Factories
import { initializeGridBreakpointsFactory } from './utils/grid.utils';

@NgModule({
  imports: [
    // External modules
    CommonModule
  ],
  declarations: [
    // Directives
    GridDirective,
    GridItemDirective
  ],
  providers: [
    { provide: GRID_BREAKPOINTS, useValue: gridBreakpoints },
    { provide: APP_INITIALIZER, useFactory: initializeGridBreakpointsFactory, deps: [GridBreakpointService], multi: true }
  ],
  exports: [
    // Directives
    GridDirective,
    GridItemDirective
  ]
})
export class GridModule {}
