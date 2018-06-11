import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GridModule } from '@zalari/ngx-grid';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    GridModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
