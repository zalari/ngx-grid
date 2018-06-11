import { BehaviorSubject } from 'rxjs';

import { Breakpoint } from '../enums/breakpoint.enum';
import { GridBreakpointService } from '../services/grid-breakpoint.service';

// provider factory method
export const initializeGridBreakpointsFactory = (gridBreakpointService: GridBreakpointService) => {
  return (): Promise<void> => gridBreakpointService.initialize();
};

// aligns the values of a given breakpoint map
export function getAlignedBreakpoints<T>(map: Map<Breakpoint, BehaviorSubject<T | undefined>>): Map<Breakpoint, T> {
  // prepare breakpoints
  const breakpoints = new Map();
  Object
    .keys(Breakpoint)
    .map((breakpoint) => Breakpoint[breakpoint])
    .map((breakpoint) => {
      // get entry corresponding to the breakpoint (might be undefined)
      if (map.has(breakpoint)) {
        return [breakpoint, map.get(breakpoint).getValue()];
      }
      // no breakpoint defined
      return [breakpoint, undefined];
    })
    .reduce(([previousBreakpoint, previousValue], [currentBreakpoint, currentValue]) => {
      // the aligned value is the previous one id the current is undefined
      const alignedValue = currentValue === undefined ? previousValue : currentValue;
      // update the results map
      breakpoints.set(currentBreakpoint, alignedValue);
      // return the currently aligned entry
      return [currentBreakpoint, alignedValue];
    }, []);

  return breakpoints;
}
