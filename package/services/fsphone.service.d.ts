export declare class FsPhone {
    determineMask(maskType: any, mask: any): any;
    getCaretDelta(caret: any, mask: any): number;
    caretPosition(caret: any, mask: any, value: any): any;
    getFirstAvailableCaretPos(mask: any): number;
    combineRegexes(mask: any): any[];
    getFittingArr(value: any, mask: any, regexArr: any): any[];
    isValidForInput(symbol: any, i: any, mask: any): boolean;
    formatValue(fittingValues: Array<any>, mask: Array<any>, caret: any, element: any, regexArr: any): any;
    private fillInValue(valueArr, mask, i);
    private replaceRecursive(valueArr, mask, i);
    private cutIt(value, mask);
    getInitialValue(mask?: Array<any>): string;
}
