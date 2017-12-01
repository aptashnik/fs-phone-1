import { Directive, ElementRef, Inject, Injectable, Input, NgModule, Renderer, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSliderModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var PHONE_MASKS = {
    ru: ['+', '7', '(', /\d/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
    us: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var INPUT_PLACEHOLDER = '_';
var FsPhone = (function () {
    function FsPhone() {
    }
    /**
     * @param {?} maskType
     * @param {?} mask
     * @return {?}
     */
    FsPhone.prototype.determineMask = /**
     * @param {?} maskType
     * @param {?} mask
     * @return {?}
     */
    function (maskType, mask) {
        if (maskType && PHONE_MASKS[maskType]) {
            return PHONE_MASKS[maskType];
        }
        else if (mask)
            return mask;
    };
    /**
     * @param {?} caret
     * @param {?} mask
     * @return {?}
     */
    FsPhone.prototype.getCaretDelta = /**
     * @param {?} caret
     * @param {?} mask
     * @return {?}
     */
    function (caret, mask) {
        var /** @type {?} */ delta = 1;
        while (typeof mask[caret + delta] == 'string')
            delta++;
        return delta;
    };
    /**
     * @param {?} caret
     * @param {?} mask
     * @param {?} value
     * @return {?}
     */
    FsPhone.prototype.caretPosition = /**
     * @param {?} caret
     * @param {?} mask
     * @param {?} value
     * @return {?}
     */
    function (caret, mask, value) {
        var /** @type {?} */ valueArr = value.split('');
        var /** @type {?} */ moveTo = caret;
        for (var /** @type {?} */ i = caret; i <= moveTo; i++) {
            if (typeof mask[i] == 'string')
                moveTo++;
        }
        return moveTo;
    };
    /**
     * @param {?} mask
     * @return {?}
     */
    FsPhone.prototype.getFirstAvailableCaretPos = /**
     * @param {?} mask
     * @return {?}
     */
    function (mask) {
        for (var /** @type {?} */ i = 0; i <= mask.length - 1; i++) {
            if (typeof mask[i] != 'string') {
                return i;
            }
        }
    };
    /**
     * @param {?} mask
     * @return {?}
     */
    FsPhone.prototype.combineRegexes = /**
     * @param {?} mask
     * @return {?}
     */
    function (mask) {
        var /** @type {?} */ regexArr = [];
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
    /**
     * @param {?} value
     * @param {?} mask
     * @param {?} regexArr
     * @return {?}
     */
    FsPhone.prototype.getFittingArr = /**
     * @param {?} value
     * @param {?} mask
     * @param {?} regexArr
     * @return {?}
     */
    function (value, mask, regexArr) {
        var /** @type {?} */ valueArr = value.split('');
        var /** @type {?} */ regexCounter = 0;
        var /** @type {?} */ fittingValues = [];
        for (var /** @type {?} */ i = 0; i < valueArr.length; i++) {
            var /** @type {?} */ regex = regexArr[regexCounter];
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
    /**
     * @param {?} symbol
     * @param {?} i
     * @param {?} mask
     * @return {?}
     */
    FsPhone.prototype.isValidForInput = /**
     * @param {?} symbol
     * @param {?} i
     * @param {?} mask
     * @return {?}
     */
    function (symbol, i, mask) {
        if (typeof mask[i] == 'object' && mask[i].test(symbol))
            return true;
        else
            return false;
    };
    /**
     * @param {?} fittingValues
     * @param {?} mask
     * @param {?} caret
     * @param {?} element
     * @param {?} regexArr
     * @return {?}
     */
    FsPhone.prototype.formatValue = /**
     * @param {?} fittingValues
     * @param {?} mask
     * @param {?} caret
     * @param {?} element
     * @param {?} regexArr
     * @return {?}
     */
    function (fittingValues, mask, caret, element, regexArr) {
        var /** @type {?} */ res = [];
        //
        if (fittingValues && fittingValues.length) {
            for (var /** @type {?} */ i = 0; i <= fittingValues[fittingValues.length - 1].index; i++) {
                if (typeof mask[i] == 'string')
                    res[i] = mask[i];
            }
            fittingValues.forEach(function (value) {
                res[value.index] = value.value;
            });
            for (var /** @type {?} */ i = res.length; i < mask.length; i++) {
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
    /**
     * @param {?} valueArr
     * @param {?} mask
     * @param {?} i
     * @return {?}
     */
    FsPhone.prototype.fillInValue = /**
     * @param {?} valueArr
     * @param {?} mask
     * @param {?} i
     * @return {?}
     */
    function (valueArr, mask, i) {
        if (valueArr[i + 1] == INPUT_PLACEHOLDER)
            valueArr.splice(i + 1, 1);
        return valueArr;
    };
    /**
     * @param {?} valueArr
     * @param {?} mask
     * @param {?} i
     * @return {?}
     */
    FsPhone.prototype.replaceRecursive = /**
     * @param {?} valueArr
     * @param {?} mask
     * @param {?} i
     * @return {?}
     */
    function (valueArr, mask, i) {
        //if its a constant
        if (typeof mask[i] == 'string') {
            if (valueArr[i] == mask[i])
                return this.replaceRecursive(valueArr, mask, ++i);
            else {
                var /** @type {?} */ tmp = valueArr[i];
                valueArr[i] = mask[i];
                if (tmp)
                    valueArr[i + 1] = tmp;
                return this.replaceRecursive(valueArr, mask, i + 1);
            }
        }
        else if (typeof mask[i] == 'object') {
            //if its a RegExp
            if (!valueArr[i])
                valueArr[i] = INPUT_PLACEHOLDER;
            valueArr = this.fillInValue(valueArr, mask, i);
            return this.replaceRecursive(valueArr, mask, ++i);
        }
        else {
            return valueArr;
        }
    };
    /**
     * @param {?} value
     * @param {?} mask
     * @return {?}
     */
    FsPhone.prototype.cutIt = /**
     * @param {?} value
     * @param {?} mask
     * @return {?}
     */
    function (value, mask) {
        return value.slice(0, mask.length);
    };
    /**
     * @param {?=} mask
     * @return {?}
     */
    FsPhone.prototype.getInitialValue = /**
     * @param {?=} mask
     * @return {?}
     */
    function (mask) {
        if (mask === void 0) { mask = null; }
        var /** @type {?} */ res = "";
        mask.forEach(function (maskElem) {
            if (typeof maskElem == 'string')
                res = res + maskElem;
            else
                res = res + INPUT_PLACEHOLDER;
        });
        return res;
    };
    FsPhone.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    FsPhone.ctorParameters = function () { return []; };
    return FsPhone;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var PHONE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return FsPhoneDirective; }),
    multi: true
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
                var /** @type {?} */ caret = _this.service.getFirstAvailableCaretPos(_this.mask);
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
                        var /** @type {?} */ caret = event.target.selectionStart;
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
    /**
     * @param {?} event
     * @return {?}
     */
    FsPhoneDirective.prototype.setInitialValue = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var /** @type {?} */ value = event.target.value;
        if (!value || !value.length) {
            this._elementRef.nativeElement.value = this.service.getInitialValue(this.mask);
            var /** @type {?} */ caret = this.service.getFirstAvailableCaretPos(this.mask);
            event.target.setSelectionRange(caret, caret);
        }
    };
    //one of hugest struggles - caret position on focus/copy-paste/deletion etc. puts caret on first unfilled input place
    /**
     * @param {?} event
     * @return {?}
     */
    FsPhoneDirective.prototype.manageCaret = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var /** @type {?} */ caret = event.target.selectionStart;
        if (event.target.value.indexOf('_') != -1 && event.target.selectionStart > event.target.value.indexOf('_'))
            caret = event.target.value.indexOf('_');
        else
            caret = this.trackCaret(event);
        event.target.setSelectionRange(caret, caret);
    };
    // sets the caret based on event happened. has some HTML-glitch hacks
    /**
     * @param {?} event
     * @param {?=} preset
     * @return {?}
     */
    FsPhoneDirective.prototype.trackCaret = /**
     * @param {?} event
     * @param {?=} preset
     * @return {?}
     */
    function (event, preset) {
        if (preset === void 0) { preset = 0; }
        var /** @type {?} */ caret = this.service.caretPosition(event.target.selectionStart, this.mask, event.target.value);
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
    /**
     * @param {?} fn
     * @return {?}
     */
    FsPhoneDirective.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onChange = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    FsPhoneDirective.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onTouched = fn; };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    FsPhoneDirective.prototype.setDisabledState = /**
     * @param {?} isDisabled
     * @return {?}
     */
    function (isDisabled) {
        this.renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    //init functions
    /**
     * @return {?}
     */
    FsPhoneDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.mask = this.service.determineMask(this.fsPhoneConfig.maskType, this.fsPhoneConfig.mask);
        this.regexes = this.service.combineRegexes(this.mask);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FsPhoneDirective.prototype.onChangeInterceptor = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var /** @type {?} */ fittingValues = this.service.getFittingArr(event.target.value, this.mask, this.regexes);
        var /** @type {?} */ newValue;
        newValue = this.service.formatValue(fittingValues, this.mask, event.target.selectionStart, event.element, this.regexes);
        this.writeValue(newValue, event.target.selectionStart);
        // this.manageCaret(event);
    };
    /**
     * @param {?} value
     * @param {?} returnHere
     * @return {?}
     */
    FsPhoneDirective.prototype.writeValue = /**
     * @param {?} value
     * @param {?} returnHere
     * @return {?}
     */
    function (value, returnHere) {
        this.renderer.setElementProperty(this._elementRef.nativeElement, 'value', value);
        var /** @type {?} */ caretDelta = 0;
        if (this.caretMove) {
            returnHere = this.caretMove + 1;
            delete this.caretMove;
        }
        else
            caretDelta = this.service.getCaretDelta(returnHere, this.mask);
        this._elementRef.nativeElement.setSelectionRange(returnHere + caretDelta, returnHere + caretDelta);
        this._onChange(value);
    };
    FsPhoneDirective.decorators = [
        { type: Directive, args: [{
                    host: {
                        '(input)': 'onChangeInterceptor($event)',
                        '(keyup)': 'onKeyup($event)',
                        '(keydown)': 'onKeydown($event)',
                        '(tap)': 'onClick($event)',
                        '(focus)': 'onFocused($event)',
                        '(paste)': 'onPaste($event)',
                        '(blur)': '_onTouched()'
                    },
                    selector: '[fs-phone]',
                    providers: [PHONE_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    FsPhoneDirective.ctorParameters = function () { return [
        { type: ElementRef, decorators: [{ type: Inject, args: [ElementRef,] },] },
        { type: Renderer, decorators: [{ type: Inject, args: [Renderer,] },] },
        { type: FsPhone, },
    ]; };
    FsPhoneDirective.propDecorators = {
        "fsPhoneConfig": [{ type: Input, args: ['fsPhoneConfig',] },],
    };
    return FsPhoneDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var FsPhoneModule = (function () {
    function FsPhoneModule() {
    }
    /**
     * @return {?}
     */
    FsPhoneModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: FsPhoneModule,
            providers: [FsPhoneDirective, FsPhone]
        };
    };
    FsPhoneModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        HttpClientModule,
                        MatAutocompleteModule,
                        MatButtonModule,
                        MatButtonToggleModule,
                        MatCardModule,
                        MatCheckboxModule,
                        MatChipsModule,
                        MatStepperModule,
                        MatDatepickerModule,
                        MatDialogModule,
                        MatExpansionModule,
                        MatGridListModule,
                        MatIconModule,
                        MatInputModule,
                        MatListModule,
                        MatMenuModule,
                        MatNativeDateModule,
                        MatPaginatorModule,
                        MatProgressBarModule,
                        MatProgressSpinnerModule,
                        MatRadioModule,
                        MatRippleModule,
                        MatSelectModule,
                        MatSidenavModule,
                        MatSliderModule,
                        MatSlideToggleModule,
                        MatSnackBarModule,
                        MatSortModule,
                        MatTableModule,
                        MatTabsModule,
                        MatToolbarModule,
                        MatTooltipModule,
                        FlexLayoutModule
                        //MATERIAL END
                    ],
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
                },] },
    ];
    /** @nocollapse */
    FsPhoneModule.ctorParameters = function () { return []; };
    return FsPhoneModule;
}());

export { FsPhoneModule, FsPhone, FsPhoneDirective };
