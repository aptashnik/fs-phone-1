import { FsPhone } from './services/fsphone.service';
import { Renderer, ElementRef, OnInit } from '@angular/core';
export declare class FsPhoneDirective implements OnInit {
    private _elementRef;
    private renderer;
    private service;
    private mask;
    private regexes;
    private caretMove;
    private goOnKeyup;
    fsPhoneConfig: {
        maskType: string;
        mask: any;
    };
    _onTouched: () => void;
    _onChange: (value: any) => void;
    onFocused: (event: any) => void;
    setInitialValue(event: any): void;
    onKeyup: (event: any) => void;
    onClick: (event: any) => void;
    manageCaret(event: any): void;
    onKeydown: (event: any) => void;
    onPaste: (event: any) => void;
    trackCaret(event: any, preset?: number): any;
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    setDisabledState(isDisabled: boolean): void;
    constructor(_elementRef: ElementRef, renderer: Renderer, service: FsPhone);
    ngOnInit(): void;
    private onChangeInterceptor(event);
    private writeValue(value, returnHere, initialCall?);
}
