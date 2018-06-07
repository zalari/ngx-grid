import { BehaviorSubject } from 'rxjs';

import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

import { getAlignedBreakpoints } from '../utils/grid.utils';
import { Breakpoint } from '../enums/breakpoint.enum';

export const GRID_CLASS = 'ngx-grid';
export const GRID_COLS_PROPERTY = '--grid-cols';
export const GRID_ROWS_PROPERTY = '--grid-rows';

@Directive({
  selector: '[grid]'
})
export class GridDirective {

  private _cols = new Map<Breakpoint, BehaviorSubject<number | undefined>>();

  private _rows = new Map<Breakpoint, BehaviorSubject<number | undefined>>();

  // @formatter:off
  @Input('cols') set cols(cols: number) { this.colsXs = cols; }
  @Input('cols.xs') set colsXs(cols: number) { this._setCols(cols, Breakpoint.ExtraSmall); }
  @Input('cols.sm') set colsSm(cols: number) { this._setCols(cols, Breakpoint.Small); }
  @Input('cols.md') set colsMd(cols: number) { this._setCols(cols, Breakpoint.Medium); }
  @Input('cols.lg') set colsLg(cols: number) { this._setCols(cols, Breakpoint.Large); }
  @Input('cols.xl') set colsXl(cols: number) { this._setCols(cols, Breakpoint.ExtraLarge); }
  // @formatter:on

  // @formatter:off
  @Input('rows') set rows(rows: number) { this.rowsXs = rows; }
  @Input('rows.xs') set rowsXs(rows: number) { this._setRows(rows, Breakpoint.ExtraSmall); }
  @Input('rows.sm') set rowsSm(rows: number) { this._setRows(rows, Breakpoint.Small); }
  @Input('rows.md') set rowsMd(rows: number) { this._setRows(rows, Breakpoint.Medium); }
  @Input('rows.lg') set rowsLg(rows: number) { this._setRows(rows, Breakpoint.Large); }
  @Input('rows.xl') set rowsXl(rows: number) { this._setRows(rows, Breakpoint.ExtraLarge); }
  // @formatter:on

  @HostBinding(`class.${GRID_CLASS}`)
  readonly setClass = true;

  constructor(private _elementRef: ElementRef<HTMLElement>) {}

  // retrieves the columns for an optionally providable breakpoint
  getCols(breakpoint: Breakpoint = Breakpoint.ExtraSmall): number | undefined {
    // get the current value of the breakpoint (might be undefined)
    if (this._cols.has(breakpoint)) {
      return this._cols.get(breakpoint).getValue();
    }

    // no cols defined for this breakpoint
    return;
  }

  // sets the column count for a specific breakpoint
  private _setCols(cols: number, breakpoint: Breakpoint = Breakpoint.ExtraSmall) {
    // create the breakpoint if it does not exist yet
    if (!this._cols.has(breakpoint)) {
      this._cols.set(breakpoint, new BehaviorSubject(undefined));
    }

    const breakpointCols = this._cols.get(breakpoint);
    const currentCols = breakpointCols.getValue();

    // do not update if the value hasn't changed
    if (cols === currentCols) {
      return;
    }

    // update the cols for the breakpoint
    breakpointCols.next(cols);

    // update the css custom properties for all breakpoints
    getAlignedBreakpoints(this._cols).forEach((alignedCols, alignedBreakpoint) => {
      this._elementRef.nativeElement.style.setProperty(`${GRID_COLS_PROPERTY}-${alignedBreakpoint}`, `${alignedCols}`);
    });
  }

  // sets the column count for a specific breakpoint
  private _setRows(rows: number, breakpoint: Breakpoint = Breakpoint.ExtraSmall) {
    // create the breakpoint if it does not exist yet
    if (!this._rows.has(breakpoint)) {
      this._rows.set(breakpoint, new BehaviorSubject(undefined));
    }

    const breakpointRows = this._rows.get(breakpoint);
    const currentRows = breakpointRows.getValue();

    // do not update if the value hasn't changed
    if (rows === currentRows) {
      return;
    }

    // update the rows for the breakpoint
    breakpointRows.next(rows);

    // update the css custom properties for all breakpoints
    getAlignedBreakpoints(this._rows).forEach((alignedRows, alignedBreakpoint) => {
      this._elementRef.nativeElement.style.setProperty(`${GRID_ROWS_PROPERTY}-${alignedBreakpoint}`, `${alignedRows}`);
    });
  }

}
