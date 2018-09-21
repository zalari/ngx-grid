import { GridBreakpointService } from '../services/grid-breakpoint.service';

// provider factory method
export const initializeGridBreakpointsFactory = (gridBreakpointService: GridBreakpointService) => {
  return (): Promise<void> => gridBreakpointService.initialize();
};
