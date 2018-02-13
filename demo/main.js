webpackJsonp([2],{

/***/ "../node_modules/css-loader/index.js??ref--2-1!../node_modules/postcss-loader/lib/index.js??ref--2-2!../node_modules/resolve-url-loader/index.js??ref--2-3!./app/components/first-example/first-example.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"first-example.component.css","sourceRoot":""}]);

// exports


/***/ }),

/***/ "../src/fsphone-masks.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PHONE_MASKS = {
    ru: ['+', '7', '(', /\d/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
    us: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
};


/***/ }),

/***/ "../src/fsphone.directive.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fsphone_service_1 = __webpack_require__("../src/services/fsphone.service.ts");
var fsphone_value_accessor_1 = __webpack_require__("../src/fsphone.value-accessor.ts");
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
/*
    Phone directive. Adds text-mask for any input-type HTML element. Has one working option right now: maskType: 'ru' | 'us', which can be easily extended by adding more phone mask constants in phone-masks.ts file.
    Consists the base of functionality of creating the universal text-mask component like https://github.com/text-mask/text-mask
    The struggle: easiest way of making this is ceating a real of shadow-DOM element, duplicating user's input, projecting all the user inputs in there and applying a mask on real element. This way in the easiest and would significantly decrease the code amount (and also the possibility of unaccounted behaviours), but would be less productive and would cause more glitches on non-standard ways of using it with components.
    By the way it works right now (only one element, all the calculations happen inside the service, separately) it's much more productive and can be used on any input element without messing up with HTML code (e.g. if developer using it would like to use jQuery, another libraries, would like to create his own element duplicate etc), but from other point adds more behaviors we could have missed usage-wise.
    In future to be perfected, a little optimised, worked on any use-case and can, indeed, become the best text-mask component on the market.
*/
var FsPhoneDirective = (function () {
    function FsPhoneDirective(_elementRef, renderer, service) {
        var _this = this;
        this._elementRef = _elementRef;
        this.renderer = renderer;
        this.service = service;
        this.fsPhoneConfig = {
            maskType: 'us',
            mask: null
        };
        //event hooks for VALUE_ACCESSOR. those are used to imitate real input behavior and emit events outside the directive, e.g. "touched"
        this._onTouched = function () {
        };
        this._onChange = function (value) { };
        this.onFocused = function (event) {
            _this.setInitialValue(event);
        };
        //some of the keys cant be processed on keydown, because they only initiate functionality after keyup
        this.onKeyup = function (event) {
            if (event.key == 'Delete' ||
                event.key == 'Backspace') {
                _this.setInitialValue(event);
            }
            else if (event.key == 'Home') {
                var caret = _this.service.getFirstAvailableCaretPos(_this.mask);
                event.target.setSelectionRange(caret, caret);
            }
            if (_this.goOnKeyup) {
                event.target.setSelectionRange(_this.goOnKeyup, _this.goOnKeyup);
                delete _this.goOnKeyup;
            }
        };
        //mouse click on input
        this.onClick = function (event) {
            _this.manageCaret(event);
        };
        //managemenet of unusual events on input, not just usual inputs
        this.onKeydown = function (event) {
            switch (event.key) {
                case 'Shift': break;
                case 'Meta': break;
                case 'ArrowRight': break;
                case 'ArrowLeft':
                    if (!event.shiftKey && !event.metaKey) {
                        var caret = event.target.selectionStart;
                        if (_this.service.getFirstAvailableCaretPos(_this.mask) >= caret)
                            caret = event.target.selectionStart + 1;
                        event.target.setSelectionRange(caret, caret);
                    }
                    else if (event.metaKey) {
                        _this.goOnKeyup = _this.service.getFirstAvailableCaretPos(_this.mask);
                    }
                    break;
                case 'Backspace':
                    _this.trackCaret(event, -2);
                    break;
                case 'Delete':
                    _this.caretMove = event.target.selectionStart - 1;
                    break;
                default:
                    _this.trackCaret(event);
            }
        };
        this.onPaste = function (event) {
            delete _this.caretMove;
        };
    }
    //sets the initial value of text-mask when first focused or when cleared
    FsPhoneDirective.prototype.setInitialValue = function (event) {
        var value = event.target.value;
        if (!value || !value.length) {
            this._elementRef.nativeElement.value = this.service.getInitialValue(this.mask);
            var caret = this.service.getFirstAvailableCaretPos(this.mask);
            event.target.setSelectionRange(caret, caret);
        }
    };
    //one of hugest struggles - caret position on focus/copy-paste/deletion etc. puts caret on first unfilled input place
    FsPhoneDirective.prototype.manageCaret = function (event) {
        var caret = event.target.selectionStart;
        if (event.target.value.indexOf('_') != -1 && event.target.selectionStart > event.target.value.indexOf('_'))
            caret = event.target.value.indexOf('_');
        else
            caret = this.trackCaret(event);
        event.target.setSelectionRange(caret, caret);
    };
    // sets the caret based on event happened. has some HTML-glitch hacks
    FsPhoneDirective.prototype.trackCaret = function (event, preset) {
        if (preset === void 0) { preset = 0; }
        var caret = this.service.caretPosition(event.target.selectionStart, this.mask, event.target.value);
        this.caretMove = caret + preset;
        //means backspace
        if (preset == -2) {
            this.caretMove = event.target.selectionStart - 2;
        }
        if (event.key && event.key.length == 1 && !this.service.isValidForInput(event.key, this.caretMove, this.mask))
            this.caretMove--;
        return this.caretMove;
    };
    // we initiate those functions to emit events outside the component
    FsPhoneDirective.prototype.registerOnChange = function (fn) { this._onChange = fn; };
    FsPhoneDirective.prototype.registerOnTouched = function (fn) { this._onTouched = fn; };
    FsPhoneDirective.prototype.setDisabledState = function (isDisabled) {
        this.renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    //init functions
    FsPhoneDirective.prototype.ngOnInit = function () {
        this.mask = this.service.determineMask(this.fsPhoneConfig.maskType, this.fsPhoneConfig.mask);
        this.regexes = this.service.combineRegexes(this.mask);
    };
    //whenever user changes anything inside the input, this function is fired. happens after the input, not wired on keypresses but on input value changes
    FsPhoneDirective.prototype.onChangeInterceptor = function (event) {
        var fittingValues = this.service.getFittingArr(event.target.value, this.mask, this.regexes);
        var newValue;
        newValue = this.service.formatValue(fittingValues, this.mask, event.target.selectionStart, event.element, this.regexes);
        this.writeValue(newValue, event.target.selectionStart, false);
        // this.manageCaret(event);
    };
    //main function used to re-write user input with the mask and emit changes out of the directive
    FsPhoneDirective.prototype.writeValue = function (value, returnHere, initialCall) {
        if (initialCall === void 0) { initialCall = true; }
        if (initialCall && !value) {
            return;
        }
        this.renderer.setElementProperty(this._elementRef.nativeElement, 'value', value);
        var caretDelta = 0;
        if (this.caretMove) {
            returnHere = this.caretMove + 1;
            delete this.caretMove;
        }
        else
            caretDelta = this.service.getCaretDelta(returnHere, this.mask);
        this._elementRef.nativeElement.setSelectionRange(returnHere + caretDelta, returnHere + caretDelta);
        this._onChange(value);
    };
    __decorate([
        core_1.Input('fsPhoneConfig'),
        __metadata("design:type", Object)
    ], FsPhoneDirective.prototype, "fsPhoneConfig", void 0);
    FsPhoneDirective = __decorate([
        core_1.Directive({
            host: {
                '(input)': 'onChangeInterceptor($event)',
                '(keyup)': 'onKeyup($event)',
                '(keydown)': 'onKeydown($event)',
                '(tap)': 'onClick($event)',
                '(focus)': 'onFocused($event)',
                '(paste)': 'onPaste($event)',
                '(blur)': '_onTouched()'
            },
            selector: '[fsPhone]',
            providers: [fsphone_value_accessor_1.PHONE_VALUE_ACCESSOR]
        }),
        __param(0, core_1.Inject(core_1.ElementRef)),
        __param(1, core_1.Inject(core_1.Renderer)),
        __metadata("design:paramtypes", [core_1.ElementRef,
            core_1.Renderer,
            fsphone_service_1.FsPhone])
    ], FsPhoneDirective);
    return FsPhoneDirective;
}());
exports.FsPhoneDirective = FsPhoneDirective;


/***/ }),

/***/ "../src/fsphone.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var common_1 = __webpack_require__("../node_modules/@angular/common/esm2015/common.js");
__webpack_require__("../node_modules/hammerjs/hammer.js");
// Components
var fsphone_directive_1 = __webpack_require__("../src/fsphone.directive.ts");
var fsphone_service_1 = __webpack_require__("../src/services/fsphone.service.ts");
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


/***/ }),

/***/ "../src/fsphone.value-accessor.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fsphone_directive_1 = __webpack_require__("../src/fsphone.directive.ts");
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var forms_1 = __webpack_require__("../node_modules/@angular/forms/esm2015/forms.js");
exports.PHONE_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return fsphone_directive_1.FsPhoneDirective; }),
    multi: true
};


/***/ }),

/***/ "../src/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../src/fsphone.module.ts"));
__export(__webpack_require__("../src/fsphone.directive.ts"));
__export(__webpack_require__("../src/services/fsphone.service.ts"));


/***/ }),

/***/ "../src/services/fsphone.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var fsphone_masks_1 = __webpack_require__("../src/fsphone-masks.ts");
var INPUT_PLACEHOLDER = '_';
var FsPhone = (function () {
    function FsPhone() {
    }
    FsPhone.prototype.determineMask = function (maskType, mask) {
        if (maskType && fsphone_masks_1.PHONE_MASKS[maskType]) {
            return fsphone_masks_1.PHONE_MASKS[maskType];
        }
        else if (mask)
            return mask;
    };
    //moves caret out of pre-set zone
    FsPhone.prototype.getCaretDelta = function (caret, mask) {
        var delta = 1;
        while (typeof mask[caret + delta] == 'string')
            delta++;
        return delta;
    };
    //determines exact caret positions
    FsPhone.prototype.caretPosition = function (caret, mask, value) {
        var valueArr = value.split('');
        var moveTo = caret;
        for (var i = caret; i <= moveTo; i++) {
            if (typeof mask[i] == 'string')
                moveTo++;
        }
        return moveTo;
    };
    //determines where to put caret when focused
    FsPhone.prototype.getFirstAvailableCaretPos = function (mask) {
        for (var i = 0; i <= mask.length - 1; i++) {
            if (typeof mask[i] != 'string') {
                return i;
            }
        }
    };
    //holding it in case of future use
    // public leftArrowCaretPosition(caret, mask) {
    //     let suitablePos = caret;
    //     for(let i = caret; i>=0; i--) {
    //
    //         if(typeof mask[i-1] == 'string') {
    //
    //             suitablePos = i-1;
    //             return this.leftArrowCaretPosition(suitablePos, mask);
    //         } else if (typeof mask[i-1] == 'undefined') { //if there is no mask at this point, means we have reached the very beginning without finding a single input place, so returning an error code
    //             return -1;
    //         } else return suitablePos;
    //     }
    //
    //     return suitablePos;
    // }
    FsPhone.prototype.combineRegexes = function (mask) {
        var regexArr = [];
        mask.forEach(function (maskVal, i) {
            if (typeof maskVal == 'object') {
                regexArr.push({
                    regex: maskVal,
                    index: i
                });
            }
        });
        return regexArr;
    };
    //text-mask consists of two types of elements - simple characters to be put for user visual and regexes to be replaced with user inputs. this function extracts characters which fit into regex and that dont overflow with string-characters (e.g. +1)
    FsPhone.prototype.getFittingArr = function (value, mask, regexArr) {
        var valueArr = value.split('');
        var regexCounter = 0;
        var fittingValues = [];
        for (var i = 0; i < valueArr.length; i++) {
            var regex = regexArr[regexCounter];
            if (regex && regex.regex.test(mask[i])) { }
            else if (regex && valueArr[i] && regex.regex.test(valueArr[i])) {
                regexCounter++;
                fittingValues.push({
                    index: regex.index,
                    value: valueArr[i]
                });
            }
        }
        return fittingValues;
    };
    //determines if current symbol is valid for user input
    FsPhone.prototype.isValidForInput = function (symbol, i, mask) {
        if (typeof mask[i] == 'object' && mask[i].test(symbol))
            return true;
        else
            return false;
    };
    //main function of formatting the value into the regex + characters from text-mask
    FsPhone.prototype.formatValue = function (fittingValues, mask, caret, element, regexArr) {
        var res = [];
        //
        if (fittingValues && fittingValues.length) {
            for (var i = 0; i <= fittingValues[fittingValues.length - 1].index; i++) {
                if (typeof mask[i] == 'string')
                    res[i] = mask[i];
            }
            fittingValues.forEach(function (value) {
                res[value.index] = value.value;
            });
            for (var i = res.length; i < mask.length; i++) {
                if (typeof mask[i] == 'string')
                    res[i] = mask[i];
                else
                    res[i] = INPUT_PLACEHOLDER;
            }
            return this.cutIt(res.join(''), mask);
        }
        else
            return '';
    };
    //fills in the value from user input
    FsPhone.prototype.fillInValue = function (valueArr, mask, i) {
        if (valueArr[i + 1] == INPUT_PLACEHOLDER)
            valueArr.splice(i + 1, 1);
        return valueArr;
    };
    //recurselivly goes through the textmask and replaces regexes with fitting characters
    FsPhone.prototype.replaceRecursive = function (valueArr, mask, i) {
        //if its a constant
        if (typeof mask[i] == 'string') {
            if (valueArr[i] == mask[i])
                return this.replaceRecursive(valueArr, mask, ++i);
            else {
                var tmp = valueArr[i];
                valueArr[i] = mask[i];
                if (tmp)
                    valueArr[i + 1] = tmp;
                return this.replaceRecursive(valueArr, mask, i + 1);
            }
        }
        else if (typeof mask[i] == 'object') {
            if (!valueArr[i])
                valueArr[i] = INPUT_PLACEHOLDER;
            valueArr = this.fillInValue(valueArr, mask, i);
            return this.replaceRecursive(valueArr, mask, ++i);
        }
        else {
            return valueArr;
        }
    };
    //cuts the string to text-mask length
    FsPhone.prototype.cutIt = function (value, mask) {
        return value.slice(0, mask.length);
    };
    //returns initial value of input
    FsPhone.prototype.getInitialValue = function (mask) {
        if (mask === void 0) { mask = null; }
        var res = "";
        mask.forEach(function (maskElem) {
            if (typeof maskElem == 'string')
                res = res + maskElem;
            else
                res = res + INPUT_PLACEHOLDER;
        });
        return res;
    };
    FsPhone = __decorate([
        core_1.Injectable()
    ], FsPhone);
    return FsPhone;
}());
exports.FsPhone = FsPhone;


/***/ }),

/***/ "../tools lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../tools lazy recursive";

/***/ }),

/***/ "../tools/assets/playground.scss":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>FsPhone Examples</h1>\n<div class=\"example\">\n    <fs-example title=\"FsPhone Example\" componentName=\"first-example\">\n        <first-example></first-example>\n    </fs-example>\n</div>\n"

/***/ }),

/***/ "./app/app.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            template: __webpack_require__("./app/app.component.html")
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;


/***/ }),

/***/ "./app/components/first-example/first-example.component.css":
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__("../node_modules/css-loader/index.js??ref--2-1!../node_modules/postcss-loader/lib/index.js??ref--2-2!../node_modules/resolve-url-loader/index.js??ref--2-3!./app/components/first-example/first-example.component.css");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),

/***/ "./app/components/first-example/first-example.component.html":
/***/ (function(module, exports) {

module.exports = "<form (ngSubmit)=\"save(form)\" #form=\"ngForm\" fsForm [fsFormBinding]=\"form\" fxLayout=\"column\">\n  <mat-form-field fxFlex>\n    <input matInput fsPhone [(ngModel)]=\"phone\" fsFormRequired=\"true\" name=\"phone\" placeholder=\"Phone\">\n  </mat-form-field>\n  <div>\n      <button type=\"submit\" mat-raised-button>Submit</button>\n  </div>\n</form>\n"

/***/ }),

/***/ "./app/components/first-example/first-example.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var FirstExampleComponent = (function () {
    function FirstExampleComponent() {
        this.phone = null;
    }
    FirstExampleComponent.prototype.save = function () {
    };
    FirstExampleComponent = __decorate([
        core_1.Component({
            selector: 'first-example',
            template: __webpack_require__("./app/components/first-example/first-example.component.html"),
            styles: [__webpack_require__("./app/components/first-example/first-example.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], FirstExampleComponent);
    return FirstExampleComponent;
}());
exports.FirstExampleComponent = FirstExampleComponent;


/***/ }),

/***/ "./app/material.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var material_1 = __webpack_require__("../node_modules/@angular/material/esm2015/material.js");
var flex_layout_1 = __webpack_require__("../node_modules/@angular/flex-layout/esm2015/flex-layout.js");
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var table_1 = __webpack_require__("../node_modules/@angular/cdk/esm2015/table.js");
var AppMaterialModule = (function () {
    function AppMaterialModule() {
    }
    AppMaterialModule = __decorate([
        core_1.NgModule({
            exports: [
                table_1.CdkTableModule,
                material_1.MatAutocompleteModule,
                material_1.MatButtonModule,
                material_1.MatButtonToggleModule,
                material_1.MatCardModule,
                material_1.MatCheckboxModule,
                material_1.MatChipsModule,
                material_1.MatStepperModule,
                material_1.MatDatepickerModule,
                material_1.MatDialogModule,
                material_1.MatExpansionModule,
                material_1.MatGridListModule,
                material_1.MatIconModule,
                material_1.MatInputModule,
                material_1.MatListModule,
                material_1.MatMenuModule,
                material_1.MatNativeDateModule,
                material_1.MatPaginatorModule,
                material_1.MatProgressBarModule,
                material_1.MatProgressSpinnerModule,
                material_1.MatRadioModule,
                material_1.MatRippleModule,
                material_1.MatSelectModule,
                material_1.MatSidenavModule,
                material_1.MatSliderModule,
                material_1.MatSlideToggleModule,
                material_1.MatSnackBarModule,
                material_1.MatSortModule,
                material_1.MatTableModule,
                material_1.MatTabsModule,
                material_1.MatToolbarModule,
                material_1.MatTooltipModule,
                flex_layout_1.FlexLayoutModule
            ]
        })
    ], AppMaterialModule);
    return AppMaterialModule;
}());
exports.AppMaterialModule = AppMaterialModule;


/***/ }),

/***/ "./main.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var playground_module_1 = __webpack_require__("./playground.module.ts");
var platform_browser_dynamic_1 = __webpack_require__("../node_modules/@angular/platform-browser-dynamic/esm2015/platform-browser-dynamic.js");
var platform_browser_1 = __webpack_require__("../node_modules/@angular/platform-browser/esm2015/platform-browser.js");
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
/**
 * Bootstrap our Angular app with a top level NgModule
 */
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic()
        .bootstrapModule(playground_module_1.PlaygroundModule)
        .then(decorateModuleRef)
        .catch(function (err) { return console.error(err); });
}
exports.main = main;
/**
 * Needed for hmr
 * in prod this is replace for document ready
 */
switch (document.readyState) {
    case 'loading':
        document.addEventListener('DOMContentLoaded', _domReadyHandler, false);
        break;
    case 'interactive':
    case 'complete':
    default:
        main();
}
function _domReadyHandler() {
    document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
    main();
}
function decorateModuleRef(modRef) {
    var appRef = modRef.injector.get(core_1.ApplicationRef);
    var cmpRef = appRef.components[0];
    var _ng = window.ng;
    platform_browser_1.enableDebugTools(cmpRef);
    window.ng.probe = _ng.probe;
    window.ng.coreTokens = _ng.coreTokens;
    return modRef;
}


/***/ }),

/***/ "./playground.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("../tools/assets/playground.scss");
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var forms_1 = __webpack_require__("../node_modules/@angular/forms/esm2015/forms.js");
var app_component_1 = __webpack_require__("./app/app.component.ts");
var platform_browser_1 = __webpack_require__("../node_modules/@angular/platform-browser/esm2015/platform-browser.js");
var src_1 = __webpack_require__("../src/index.ts");
var animations_1 = __webpack_require__("../node_modules/@angular/platform-browser/esm2015/animations.js");
var material_module_1 = __webpack_require__("./app/material.module.ts");
var first_example_component_1 = __webpack_require__("./app/components/first-example/first-example.component.ts");
var example_1 = __webpack_require__("../node_modules/@firestitch/example/package/index.js");
var form_1 = __webpack_require__("../node_modules/@firestitch/form/package/index.js");
var PlaygroundModule = (function () {
    function PlaygroundModule() {
    }
    PlaygroundModule = __decorate([
        core_1.NgModule({
            bootstrap: [app_component_1.AppComponent],
            imports: [
                platform_browser_1.BrowserModule,
                src_1.FsPhoneModule,
                animations_1.BrowserAnimationsModule,
                material_module_1.AppMaterialModule,
                forms_1.FormsModule,
                form_1.FsFormModule,
                example_1.FsExampleModule
            ],
            entryComponents: [],
            declarations: [
                app_component_1.AppComponent,
                first_example_component_1.FirstExampleComponent
            ],
            providers: [],
        })
    ], PlaygroundModule);
    return PlaygroundModule;
}());
exports.PlaygroundModule = PlaygroundModule;


/***/ })

},["./main.ts"]);
//# sourceMappingURL=main.map