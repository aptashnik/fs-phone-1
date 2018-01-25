import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'hammerjs';
// Components
import { FsPhoneDirective } from './fsphone.directive';
import { FsPhone } from './services/fsphone.service';

@NgModule({
  imports: [
    // Angular
    CommonModule
  ],
  exports: [
    FsPhoneDirective,
  ],
  entryComponents: [
  ],
  declarations: [
    FsPhoneDirective,
  ],
  providers: [
    FsPhone
  ],
})
export class FsPhoneModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsPhoneModule,
      providers: [FsPhone]
    };
  }
}
