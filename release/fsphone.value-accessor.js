"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fsphone_directive_1 = require("./fsphone.directive");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
exports.PHONE_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return fsphone_directive_1.FsPhoneDirective; }),
    multi: true
};
//# sourceMappingURL=fsphone.value-accessor.js.map