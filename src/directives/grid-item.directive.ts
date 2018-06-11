import { BehaviorSubject } from 'rxjs';

import { Directive, ElementRef, HostBinding, Input, OnInit, Optional } from '@angular/core';

import { getAlignedBreakpoints } from '../utils/grid.utils';
import { Breakpoint } from '../enums/breakpoint.enum';
import { GridDirective } from './grid.directive';

export const GRID_ITEM_CLASS = 'ngx-grid-item';
export const GRID_COL_SPAN_PROPERTY = '--grid-col-span';
export const GRID_ROW_SPAN_PROPERTY = '--grid-row-span';
export const GRID_COL_START_PROPERTY = '--grid-col-start';
export const GRID_ROW_START_PROPERTY = '--grid-row-start';

@Directive({
  selector: '[gridItem]'
})
export class GridItemDirective implements OnInit {

  private _colSpan = new Map<Breakpoint, BehaviorSubject<number | undefined>>();

  private _rowSpan = new Map<Breakpoint, BehaviorSubject<number | undefined>>();

  private _colStart = new Map<Breakpoint, BehaviorSubject<number | 'auto' | undefined>>();

  private _rowStart = new Map<Breakpoint, BehaviorSubject<number | 'auto' | undefined>>();

  // @formatter:off
  @Input('col.span') set colSpan(colSpan: number) { this.colSpanXs = colSpan; }
  @Input('col.span.xs') set colSpanXs(colSpan: number) { this._setColSpan(colSpan, Breakpoint.ExtraSmall); }
  @Input('col.span.sm') set colSpanSm(colSpan: number) { this._setColSpan(colSpan, Breakpoint.Small); }
  @Input('col.span.md') set colSpanMd(colSpan: number) { this._setColSpan(colSpan, Breakpoint.Medium); }
  @Input('col.span.lg') set colSpanLg(colSpan: number) { this._setColSpan(colSpan, Breakpoint.Large); }
  @Input('col.span.xl') set colSpanXl(colSpan: number) { this._setColSpan(colSpan, Breakpoint.ExtraLarge); }
  // @formatter:on

  // @formatter:off
  @Input('row.span') set rowSpan(rowSpan: number) { this.rowSpanXs = rowSpan; }
  @Input('row.span.xs') set rowSpanXs(rowSpan: number) { this._setRowSpan(rowSpan, Breakpoint.ExtraSmall); }
  @Input('row.span.sm') set rowSpanSm(rowSpan: number) { this._setRowSpan(rowSpan, Breakpoint.Small); }
  @Input('row.span.md') set rowSpanMd(rowSpan: number) { this._setRowSpan(rowSpan, Breakpoint.Medium); }
  @Input('row.span.lg') set rowSpanLg(rowSpan: number) { this._setRowSpan(rowSpan, Breakpoint.Large); }
  @Input('row.span.xl') set rowSpanXl(rowSpan: number) { this._setRowSpan(rowSpan, Breakpoint.ExtraLarge); }
  // @formatter:on

  // @formatter:off
  @Input('col.start') set colStart(colStart: number | 'auto') { this.colStartXs = colStart; }
  @Input('col.start.xs') set colStartXs(colStart: number | 'auto') { this._setColStart(colStart, Breakpoint.ExtraSmall); }
  @Input('col.start.sm') set colStartSm(colStart: number | 'auto') { this._setColStart(colStart, Breakpoint.Small); }
  @Input('col.start.md') set colStartMd(colStart: number | 'auto') { this._setColStart(colStart, Breakpoint.Medium); }
  @Input('col.start.lg') set colStartLg(colStart: number | 'auto') { this._setColStart(colStart, Breakpoint.Large); }
  @Input('col.start.xl') set colStartXl(colStart: number | 'auto') { this._setColStart(colStart, Breakpoint.ExtraLarge); }
  // @formatter:on

  // @formatter:off
  @Input('row.start') set rowStart(rowStart: number | 'auto') { this.rowStartXs = rowStart; }
  @Input('row.start.xs') set rowStartXs(rowStart: number | 'auto') { this._setRowStart(rowStart, Breakpoint.ExtraSmall); }
  @Input('row.start.sm') set rowStartSm(rowStart: number | 'auto') { this._setRowStart(rowStart, Breakpoint.Small); }
  @Input('row.start.md') set rowStartMd(rowStart: number | 'auto') { this._setRowStart(rowStart, Breakpoint.Medium); }
  @Input('row.start.lg') set rowStartLg(rowStart: number | 'auto') { this._setRowStart(rowStart, Breakpoint.Large); }
  @Input('row.start.xl') set rowStartXl(rowStart: number | 'auto') { this._setRowStart(rowStart, Breakpoint.ExtraLarge); }
  // @formatter:on

  @HostBinding(`class.${GRID_ITEM_CLASS}`)
  readonly setClass = true;

  constructor(private _elementRef: ElementRef<HTMLElement>,
              @Optional() private _grid: GridDirective) {
    if (!this._grid) {
      throw new Error('The GridItemDirective shall be used inside a GridDirective only');
    }
  }

  ngOnInit() {
    // set default value for the column span
    if (!this._colSpan.has(Breakpoint.ExtraSmall)) {
      this._setColSpan(1, Breakpoint.ExtraSmall);
    }

    // set default value for the row span
    if (!this._rowSpan.has(Breakpoint.ExtraSmall)) {
      this._setRowSpan(1, Breakpoint.ExtraSmall);
    }

    // set default value for the column offset
    if (!this._colStart.has(Breakpoint.ExtraSmall)) {
      this._setColStart('auto', Breakpoint.ExtraSmall);
    }

    // set default value for the row offset
    if (!this._rowStart.has(Breakpoint.ExtraSmall)) {
      this._setRowStart('auto', Breakpoint.ExtraSmall);
    }
  }

  // sets the column count for a specific breakpoint
  private _setColSpan(colSpan: number, breakpoint: Breakpoint = Breakpoint.ExtraSmall) {
    // create the breakpoint if it does not exist yet
    if (!this._colSpan.has(breakpoint)) {
      this._colSpan.set(breakpoint, new BehaviorSubject(undefined));
    }

    const breakpointColSpan = this._colSpan.get(breakpoint);
    const availableColSpan = this._grid.getCols(breakpoint);
    const currentColSpan = breakpointColSpan.getValue();

    // align to the available colSpan in the grid
    // TODO: should we warn or smth.?
    if (colSpan > availableColSpan) {
      colSpan = availableColSpan;
    }

    // do not update if the value hasn't changed
    if (colSpan === currentColSpan) {
      return;
    }

    // update the colSpan for the breakpoint
    breakpointColSpan.next(colSpan);

    // update the css custom properties for all breakpoints
    getAlignedBreakpoints(this._colSpan).forEach((alignedColSpan, alignedBreakpoint) => {
      this._elementRef.nativeElement.style.setProperty(`${GRID_COL_SPAN_PROPERTY}-${alignedBreakpoint}`, `${alignedColSpan}`);
    });
  }

  // sets the row count for a specific breakpoint
  private _setRowSpan(rowSpan: number, breakpoint: Breakpoint = Breakpoint.ExtraSmall) {
    // create the breakpoint if it does not exist yet
    if (!this._rowSpan.has(breakpoint)) {
      this._rowSpan.set(breakpoint, new BehaviorSubject(undefined));
    }

    const breakpointRowSpan = this._rowSpan.get(breakpoint);
    const currentRowSpan = breakpointRowSpan.getValue();

    // do not update if the value hasn't changed
    if (rowSpan === currentRowSpan) {
      return;
    }

    // update the rowSpan for the breakpoint
    breakpointRowSpan.next(rowSpan);

    // update the css custom properties for all breakpoints
    getAlignedBreakpoints(this._rowSpan).forEach((alignedRowSpan, alignedBreakpoint) => {
      this._elementRef.nativeElement.style.setProperty(`${GRID_ROW_SPAN_PROPERTY}-${alignedBreakpoint}`, `${alignedRowSpan}`);
    });
  }

  // sets the column offset for a specific breakpoint
  private _setColStart(colStart: number | 'auto', breakpoint: Breakpoint = Breakpoint.ExtraSmall) {
    // create the breakpoint if it does not exist yet
    if (!this._colStart.has(breakpoint)) {
      this._colStart.set(breakpoint, new BehaviorSubject(undefined));
    }

    const currentColSpan = getAlignedBreakpoints(this._colSpan).get(breakpoint);
    const availableColStart = this._grid.getCols(breakpoint) - currentColSpan + 1;
    const breakpointColStart = this._colStart.get(breakpoint);
    const currentColStart = breakpointColStart.getValue();

    // align to the available offset in the grid (which is the grid
    // template column count minus the colSpan defined for this item)
    // TODO: should we warn or smth.?
    if (colStart > availableColStart) {
      colStart = availableColStart;
    }

    // do not update if the value hasn't changed
    if (colStart === currentColStart) {
      return;
    }

    // update the column offset for the breakpoint
    breakpointColStart.next(colStart);

    // update the css custom properties for all breakpoints
    getAlignedBreakpoints(this._colStart).forEach((alignedColStart, alignedBreakpoint) => {
      this._elementRef.nativeElement.style.setProperty(`${GRID_COL_START_PROPERTY}-${alignedBreakpoint}`, `${alignedColStart}`);
    });
  }

  // sets the row offset for a specific breakpoint
  private _setRowStart(rowStart: number | 'auto', breakpoint: Breakpoint = Breakpoint.ExtraSmall) {
    // create the breakpoint if it does not exist yet
    if (!this._rowStart.has(breakpoint)) {
      this._rowStart.set(breakpoint, new BehaviorSubject(undefined));
    }

    const breakpointRowStart = this._rowStart.get(breakpoint);
    const currentRowStart = breakpointRowStart.getValue();

    // do not update if the value hasn't changed
    if (rowStart === currentRowStart) {
      return;
    }

    // update the row offset for the breakpoint
    breakpointRowStart.next(rowStart);

    // update the css custom properties for all breakpoints
    getAlignedBreakpoints(this._rowStart).forEach((alignedRowStart, alignedBreakpoint) => {
      this._elementRef.nativeElement.style.setProperty(`${GRID_ROW_START_PROPERTY}-${alignedBreakpoint}`, `${alignedRowStart}`);
    });
  }

}
