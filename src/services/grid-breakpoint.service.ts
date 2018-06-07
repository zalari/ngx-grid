import { Inject, Injectable } from '@angular/core';

import { GRID_BREAKPOINTS } from '../injection-tokens/grid-breakpoints.injection-token';
import { GridBreakpoints } from '../interfaces/grid-breakpoints.interface';
import { Breakpoint } from '../enums/breakpoint.enum';

export const INJECTED_STYLE_ID = 'ngx-grid-style';

@Injectable({
  providedIn: 'root'
})
export class GridBreakpointService {

  private get _isStyleInjected(): boolean {
    return window.document.getElementById(INJECTED_STYLE_ID) !== null;
  }

  constructor(@Inject(GRID_BREAKPOINTS) private _gridBreakpoints: GridBreakpoints) {}

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      if (!this._isStyleInjected) {
        const head: HTMLHeadElement = window.document.querySelector('head');
        const style: HTMLStyleElement = window.document.createElement('style');

        // prepare style sheet
        let styleDefinitions = `
.ngx-grid {
  /* set default values for smallest breakpoint */
  --grid-gap-xs: 10;
  --grid-cols-xs: 1;
  --grid-rows-xs: 1;

  display: grid;
  grid-auto-flow: row dense;
  grid-auto-rows: 1fr;
  grid-gap: var(--grid-gap-xs);

  @media (min-width: ${this._gridBreakpoints[Breakpoint.ExtraSmall]}px) {
    /* we want _no_ equal heights on the smallest viewport
    because usually we have only one column here... */
    grid-auto-rows: min-content;
  }
}

.ngx-grid-item {
  --grid-col-span-xs: 1;
  --grid-row-span-xs: 1;
  --grid-col-start-xs: auto;
  --grid-row-start-xs: auto;
}
        `;

        // add media queries
        Object
          .keys(this._gridBreakpoints)
          .forEach((breakpoint: Breakpoint) => {
            styleDefinitions += `
/* prepare all breakpoints by updating... */
@media (min-width: ${this._gridBreakpoints[breakpoint]}px) {
  .ngx-grid {
      /* ... the column gap...
      grid-gap: var(--grid-gap-${breakpoint});

      /* ... and the columns count */
      grid-template-columns: repeat(var(--grid-cols-${breakpoint}), 1fr);
      grid-template-rows: repeat(var(--grid-rows-${breakpoint}), 1fr);
  }

  .ngx-grid-item {
      /* ... and the col and row spans */
      grid-column: var(--grid-col-start-${breakpoint}) / span var(--grid-col-span-${breakpoint});
      grid-row: var(--grid-row-start-${breakpoint}) / span var(--grid-row-span-${breakpoint});
  }
}
            `;
          });

        // set style sheet arguments
        style.id = INJECTED_STYLE_ID;
        style.type = 'text/css';
        style.innerHTML = styleDefinitions;

        // add the created style sheet to the head
        head.appendChild(style);
      }

      resolve();
    });
  }

}
