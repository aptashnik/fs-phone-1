import { FsPhone } from './fsphone.service';
import { FormsModule } from '@angular/forms';
import { FsPhoneDirective } from './fsphone.directive';
import { NgModule } from '@angular/core';
@NgModule({
    declarations: [
        FsPhoneDirective
    ],
    providers: [
        FsPhoneDirective,
        FsPhone
    ],
    exports: [
        FsPhoneDirective
    ]
})
export class FsPhoneModule {

}
