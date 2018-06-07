import { InjectionToken } from '@angular/core';
import { GridBreakpoints } from '../interfaces/grid-breakpoints.interface';

export const GRID_BREAKPOINTS = new InjectionToken<GridBreakpoints>('GRID_BREAKPOINTS');

export const gridBreakpoints: GridBreakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 1200,
  xl: 1656
};
