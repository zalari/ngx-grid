import { BehaviorSubject, Observable } from 'rxjs';

import { Inject, Injectable } from '@angular/core';

import { GRID_BREAKPOINTS } from '../injection-tokens/grid-breakpoints.injection-token';
import { GridBreakpoints } from '../interfaces/grid-breakpoints.interface';
import { Breakpoint } from '../enums/breakpoint.enum';

export const INJECTED_STYLE_ID = 'ngx-grid-style';

@Injectable({
  providedIn: 'root'
})
export class GridBreakpointService {

  private _queryListeners = new Map<Breakpoint, MediaQueryList>();

  private _currentBreakpoint = new BehaviorSubject<Breakpoint>(Breakpoint.ExtraSmall);

  private get _isStyleInjected(): boolean {
    return window.document.getElementById(INJECTED_STYLE_ID) !== null;
  }

  get currentBreakpoint(): Observable<Breakpoint> {
    return this._currentBreakpoint.asObservable();
  }

  constructor(@Inject(GRID_BREAKPOINTS) private _gridBreakpoints: GridBreakpoints) {
    // initialize the listener
    this._initializeQueryListeners();
  }

  // initializes the grid by injecting styles to the head section
  initialize(): Promise<void> {
    return new Promise((resolve) => {
      if (!this._isStyleInjected) {
        const head: HTMLHeadElement = window.document.querySelector('head');
        const style: HTMLStyleElement = window.document.createElement('style');

        // prepare style sheet
        let styleDefinitions = `
          :root {
            /* set default values for smallest breakpoint... */
            /* ... for the grids itselfs... */
            --grid-gap: 10;
            --grid-cols: 1;
            --grid-rows: 1;
            
            /* ... and for the grid columns */
            --grid-col-span: 1;
            --grid-row-span: 1;
            --grid-col-start: auto;
            --grid-row-start: auto;
          }
        
          .ngx-grid {
            display: grid;
            grid-auto-flow: row dense;
            grid-auto-rows: 1fr;
            grid-gap: calc(var(--grid-gap) * 1px);
            grid-template-columns: repeat(var(--grid-cols), 1fr);
            grid-template-rows: repeat(var(--grid-rows), 1fr);

            @media ${this._buildQuery(Breakpoint.ExtraSmall)} {
              /* we want _no_ equal heights on the smallest viewport because usually we have only one column here... */
              grid-auto-rows: min-content;
            }
          }

          .ngx-grid-item {
            grid-column: var(--grid-col-start) / span var(--grid-col-span);
            grid-row: var(--grid-row-start) / span var(--grid-row-span);
          }
        `;

        // add media queries
        Object
          .keys(this._gridBreakpoints)
          .forEach((breakpoint: Breakpoint) => {
            styleDefinitions += `
              /* prepare all breakpoints by updating... */
              @media ${this._buildQuery(breakpoint)} {
                :root {
                    /* ... the column gap... */
                    --grid-gap: var(--grid-gap-${breakpoint});

                    /* ... and the columns count */
                    --grid-cols: var(--grid-cols-${breakpoint});
                    --grid-rows: var(--grid-rows-${breakpoint});
                    
                    /* ... and the col and row spans and offsets */
                    --grid-col-start: var(--grid-col-start-${breakpoint});
                    --grid-col-span: var(--grid-col-span-${breakpoint});
                    --grid-row-start: var(--grid-row-start-${breakpoint});
                    --grid-row-span: var(--grid-row-span-${breakpoint});
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

  // registers a media query listener
  registerListener(breakpoint: Breakpoint, listener: MediaQueryListListener) {
    // return if breakpoint is unknown
    if (!Object.values(Breakpoint)
      .includes(breakpoint)) {
      throw new Error(`The breakpoint "${breakpoint}" is unknown`);
    }

    // return if breakpoint is not initialized
    if (!this._queryListeners.has(breakpoint)) {
      throw new Error(`The breakpoint "${breakpoint}" is not initialized`);
    }

    // register the listener for the specific breakpoint
    this._queryListeners.get(breakpoint)
      .addListener(listener);
  }

  // unregisters a media query listener
  unregisterListener(breakpoint: Breakpoint, listener: MediaQueryListListener) {
    // return if breakpoint is unknown
    if (!Object.values(Breakpoint)
      .includes(breakpoint)) {
      throw new Error(`The breakpoint "${breakpoint}" is unknown`);
    }

    // return if breakpoint is not initialized
    if (!this._queryListeners.has(breakpoint)) {
      throw new Error(`The breakpoint "${breakpoint}" is not initialized`);
    }

    // register the listener for the specific breakpoint
    this._queryListeners.get(breakpoint)
      .removeListener(listener);
  }

  private _initializeQueryListeners() {
    Object
      .keys(this._gridBreakpoints)
      .forEach((breakpoint: Breakpoint) => {
        // create listener and keep reference
        const query = this._buildQuery(breakpoint);
        const queryListener = window.matchMedia(query);
        this._queryListeners.set(breakpoint, queryListener);

        // register internal listener
        queryListener.addListener((queryList) => this._breakpointQueryListener(breakpoint, queryList));
      });
  }

  private _breakpointQueryListener(breakpoint: Breakpoint, queryList: MediaQueryList) {
    // if the query matches, the breakpoint is active
    if (queryList.matches) {
      this._currentBreakpoint.next(breakpoint);
    }
    // if not, the next smaller one is active
    else {
      this._currentBreakpoint.next(this._previousBreakpoint(breakpoint));
    }
  }

  private _previousBreakpoint(breakpoint: Breakpoint): Breakpoint | undefined {
    const breakpoints = Object.values(Breakpoint);
    const currentIndex = breakpoints.indexOf(breakpoint);
    return breakpoints[currentIndex - 1];
  }

  private _buildQuery(breakpoint: Breakpoint): string {
    return `(min-width: ${this._gridBreakpoints[breakpoint]}px)`;
  }

}
