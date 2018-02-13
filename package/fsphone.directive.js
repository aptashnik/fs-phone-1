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
var fsphone_service_1 = require("./services/fsphone.service");
var fsphone_value_accessor_1 = require("./fsphone.value-accessor");
var core_1 = require("@angular/core");
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
//# sourceMappingURL=fsphone.directive.js.map