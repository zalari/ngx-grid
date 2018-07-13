import { BehaviorSubject } from 'rxjs';

import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

import { Breakpoint } from '../enums/breakpoint.enum';
import { GridBreakpointService } from '../services/grid-breakpoint.service';

export const GRID_CLASS = 'ngx-grid';
export const GRID_COLS_PROPERTY = '--grid-cols';
export const GRID_ROWS_PROPERTY = '--grid-rows';
export const GRID_GAP_PROPERTY = '--grid-gap';

@Directive({
  selector: '[grid]'
})
export class GridDirective {

  private _cols = new Map<string, BehaviorSubject<number | undefined>>();

  private _rows = new Map<string, BehaviorSubject<number | undefined>>();

  private _gap = new Map<string, BehaviorSubject<number | undefined>>();

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

  // @formatter:off
  @Input('gap') set gap(gap: number) { this.gapXs = gap; }
  @Input('gap.xs') set gapXs(gap: number) { this._setGap(gap, Breakpoint.ExtraSmall); }
  @Input('gap.sm') set gapSm(gap: number) { this._setGap(gap, Breakpoint.Small); }
  @Input('gap.md') set gapMd(gap: number) { this._setGap(gap, Breakpoint.Medium); }
  @Input('gap.lg') set gapLg(gap: number) { this._setGap(gap, Breakpoint.Large); }
  @Input('gap.xl') set gapXl(gap: number) { this._setGap(gap, Breakpoint.ExtraLarge); }
  // @formatter:on

  @HostBinding(`class.${GRID_CLASS}`)
  readonly setClass = true;

  constructor(private _elementRef: ElementRef<HTMLElement>,
              private _gridBreakpointService: GridBreakpointService) {}

  // retrieves the columns for an optionally providable breakpoint
  getCols(breakpoint: string = this._gridBreakpointService.smallestBreakpoint): number | undefined {
    // get the current value of the breakpoint (might be undefined)
    if (this._cols.has(breakpoint)) {
      return this._cols.get(breakpoint).getValue();
    }

    // no cols defined for this breakpoint
    return;
  }

  // sets the column count for a specific breakpoint
  private _setCols(cols: number, breakpoint: string = this._gridBreakpointService.smallestBreakpoint) {
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
    console.log(this._cols, this._gridBreakpointService.getAlignedBreakpoints(this._cols))
    this._gridBreakpointService
      .getAlignedBreakpoints(this._cols)
      .forEach((alignedCols, alignedBreakpoint) => {
        this._elementRef.nativeElement.style.setProperty(`${GRID_COLS_PROPERTY}-${alignedBreakpoint}`, `${alignedCols}`);
      });
  }

  // sets the column count for a specific breakpoint
  private _setRows(rows: number, breakpoint: string = this._gridBreakpointService.smallestBreakpoint) {
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
    this._gridBreakpointService
      .getAlignedBreakpoints(this._rows)
      .forEach((alignedRows, alignedBreakpoint) => {
        this._elementRef.nativeElement.style.setProperty(`${GRID_ROWS_PROPERTY}-${alignedBreakpoint}`, `${alignedRows}`);
      });
  }

  // sets the column count for a specific breakpoint
  private _setGap(gap: number, breakpoint: string = this._gridBreakpointService.smallestBreakpoint) {
    // create the breakpoint if it does not exist yet
    if (!this._gap.has(breakpoint)) {
      this._gap.set(breakpoint, new BehaviorSubject(undefined));
    }

    const breakpointGap = this._gap.get(breakpoint);
    const currentGap = breakpointGap.getValue();

    // do not update if the value hasn't changed
    if (gap === currentGap) {
      return;
    }

    // update the gap for the breakpoint
    breakpointGap.next(gap);

    // update the css custom properties for all breakpoints
    this._gridBreakpointService
      .getAlignedBreakpoints(this._gap)
      .forEach((alignedGap, alignedBreakpoint) => {
        this._elementRef.nativeElement.style.setProperty(`${GRID_GAP_PROPERTY}-${alignedBreakpoint}`, `${alignedGap}`);
      });
  }

}
