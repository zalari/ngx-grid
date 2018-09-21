import { InjectionToken } from '@angular/core';
import { GridBreakpoints } from '../interfaces/grid-breakpoints.interface';

export const GRID_BREAKPOINTS = new InjectionToken<GridBreakpoints>('GRID_BREAKPOINTS');

export const gridBreakpoints: GridBreakpoints = {
  lg: 1200,
  xs: 0,
  md: 768,
  sm: 576,
  xl: 1656
};
