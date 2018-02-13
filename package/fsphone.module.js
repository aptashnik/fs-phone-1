"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
require("hammerjs");
// Components
var fsphone_directive_1 = require("./fsphone.directive");
var fsphone_service_1 = require("./services/fsphone.service");
var FsPhoneModule = (function () {
    function FsPhoneModule() {
    }
    FsPhoneModule_1 = FsPhoneModule;
    FsPhoneModule.forRoot = function () {
        return {
            ngModule: FsPhoneModule_1,
            providers: [fsphone_service_1.FsPhone]
        };
    };
    FsPhoneModule = FsPhoneModule_1 = __decorate([
        core_1.NgModule({
            imports: [
                // Angular
                common_1.CommonModule
            ],
            exports: [
                fsphone_directive_1.FsPhoneDirective,
            ],
            entryComponents: [],
            declarations: [
                fsphone_directive_1.FsPhoneDirective,
            ],
            providers: [
                fsphone_service_1.FsPhone
            ],
        })
    ], FsPhoneModule);
    return FsPhoneModule;
    var FsPhoneModule_1;
}());
exports.FsPhoneModule = FsPhoneModule;
//# sourceMappingURL=fsphone.module.js.map