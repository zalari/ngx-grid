import { BehaviorSubject, Observable } from 'rxjs';

import { Inject, Injectable } from '@angular/core';

import { GRID_BREAKPOINTS } from '../injection-tokens/grid-breakpoints.injection-token';
import { GridBreakpoints } from '../interfaces/grid-breakpoints.interface';

export const INJECTED_STYLE_ID = 'ngx-grid-style';

@Injectable({
  providedIn: 'root'
})
export class GridBreakpointService {

  private readonly _smallestBreakpoint: string;

  private readonly _breakpoints = new Map<string, number>();

  private _currentBreakpoint: BehaviorSubject<string>;

  private _queryListeners = new Map<string, MediaQueryList>();

  private get _isStyleInjected(): boolean {
    return window.document.getElementById(INJECTED_STYLE_ID) !== null;
  }

  get currentBreakpoint(): Observable<string> {
    return this._currentBreakpoint.asObservable();
  }

  get smallestBreakpoint(): string {
    return this._smallestBreakpoint;
  }

  constructor(@Inject(GRID_BREAKPOINTS) private readonly _gridBreakpoints: GridBreakpoints) {
    // ensure breakpoint sorting
    this._breakpoints = this._sortBreakpoints(this._gridBreakpoints);

    // initialize current breakpoint from smallest entry
    this._smallestBreakpoint = Array.from(this._breakpoints.keys())[0];
    this._currentBreakpoint = new BehaviorSubject(this._smallestBreakpoint);

    // initialize the listener
    this._initializeQueryListeners();
  }

  // initializes the grid by injecting styles to the head section
  initialize(): Promise<void> {
    return new Promise(resolve => {
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

            @media ${this._buildQuery(this._smallestBreakpoint)} {
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
        this._breakpoints
          .forEach((value, breakpoint) => {
            styleDefinitions += `
              /* prepare all breakpoints by updating... */
              @media ${this._buildQuery(breakpoint)} {
                .ngx-grid {
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
  registerListener(breakpoint: string, listener: MediaQueryListListener) {
    // return if breakpoint is unknown
    if (!this._breakpoints.has(breakpoint)) {
      throw new Error(`The breakpoint "${breakpoint}" is unknown`);
    }

    // return if breakpoint is not initialized
    if (!this._queryListeners.has(breakpoint)) {
      throw new Error(`The breakpoint "${breakpoint}" is not initialized`);
    }

    // register the listener for the specific breakpoint
    this._queryListeners
      .get(breakpoint)
      .addListener(listener);
  }

  // unregisters a media query listener
  unregisterListener(breakpoint: string, listener: MediaQueryListListener) {
    // return if breakpoint is unknown
    if (!this._breakpoints.has(breakpoint)) {
      throw new Error(`The breakpoint "${breakpoint}" is unknown`);
    }

    // return if breakpoint is not initialized
    if (!this._queryListeners.has(breakpoint)) {
      throw new Error(`The breakpoint "${breakpoint}" is not initialized`);
    }

    // register the listener for the specific breakpoint
    this._queryListeners
      .get(breakpoint)
      .removeListener(listener);
  }

  getAlignedBreakpoints<T>(map: Map<string, BehaviorSubject<T | undefined>>): Map<string, T> {
    // prepare breakpoints
    const breakpoints = new Map();
    Array
      .from(this._breakpoints.keys())
      .map(breakpoint => {
        // get entry corresponding to the breakpoint (might be undefined)
        if (map.has(breakpoint)) {
          return [breakpoint, map.get(breakpoint).getValue()];
        }
        // no breakpoint defined
        return [breakpoint, undefined];
      })
      .reduce(([previousBreakpoint, previousValue], [currentBreakpoint, currentValue]) => {
        // the aligned value is the previous one if the current is undefined
        const alignedValue = currentValue === undefined ? previousValue : currentValue;
        // update the results map
        breakpoints.set(currentBreakpoint, alignedValue);
        // return the currently aligned entry
        return [currentBreakpoint, alignedValue];
      }, []);

    return breakpoints;
  }

  private _sortBreakpoints(breakpoints: GridBreakpoints): Map<string, number> {
    // https://stackoverflow.com/a/16794116/1146207
    const sortedBreakpoints = new Map<string, number>();
    Object
      .keys(breakpoints)
      .sort((a, b) => breakpoints[a] - breakpoints[b])
      .forEach(breakpoint => {
        sortedBreakpoints.set(breakpoint, breakpoints[breakpoint]);
      });

    return sortedBreakpoints;
  }

  private _initializeQueryListeners() {
    this._breakpoints
      .forEach((value, breakpoint) => {
        // create listener and keep reference
        const query = this._buildQuery(breakpoint);
        const queryListener = window.matchMedia(query);
        this._queryListeners.set(breakpoint, queryListener);

        // register internal listener
        queryListener.addListener(() => this._findCurrentBreakpoint());
      });

    // find current breakpoint initially
    this._findCurrentBreakpoint();
  }

  private _findCurrentBreakpoint() {
    // find the currently matching breakpoint
    const matchingBreakpoint = Array
       .from(this._queryListeners.keys())
       // the last breakpoint that matches, fallback to smallest
       .reduce((previousBreakpoint, currentBreakpoint) => {
         return this._queryListeners.get(currentBreakpoint).matches ? currentBreakpoint : previousBreakpoint;
       }, this._smallestBreakpoint);

    // update the subject
    this._currentBreakpoint.next(matchingBreakpoint);
  }

  private _buildQuery(breakpoint: string): string {
    return `(min-width: ${this._gridBreakpoints[breakpoint]}px)`;
  }

}
