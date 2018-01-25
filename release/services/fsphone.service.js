"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var fsphone_masks_1 = require("./../fsphone-masks");
var INPUT_PLACEHOLDER = '_';
var FsPhone = /** @class */ (function () {
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
//# sourceMappingURL=fsphone.service.js.map