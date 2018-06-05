import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Directives
import { GridItemDirective } from './directives/grid-item/grid-item.directive';
// Components
import { GridComponent } from './components/grid/grid.component';

@NgModule({
  imports: [
    // External modules
    CommonModule
  ],
  declarations: [
    // Directives
    GridItemDirective,

    // Components
    GridComponent
  ],
  exports: [
    // Directives
    GridItemDirective,

    // Components
    GridComponent
  ]
})
export class GridModule {}
