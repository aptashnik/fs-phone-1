import './vendor.scss';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { AppComponent } from './app/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FsPhoneModule } from '../src';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FsFormModule } from '@firestitch/form';

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    // Angular
    FormsModule,
    BrowserModule,
    FsPhoneModule,
    BrowserAnimationsModule,
    FsFormModule,
    MatInputModule
  ],
  entryComponents: [
  ],
  declarations: [
    AppComponent
  ],
  providers: [
  ],
})
export class PlaygroundModule {
}
