"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const fsm_Main_1 = require("../src/fsm_Main");
describe('Alignment Engine Tests', () => {
    it('should preserve indentation', () => {
        const input = `    import {
        type LanguageRules,
        DEFAULT_CONFIG,
        languageRules_Detect,
        text_AlignByBlocks
    } from './fsm_Main'`;
        const expected = `    import {
        type LanguageRules  , 
        DEFAULT_CONFIG      , 
        languageRules_Detect, 
        text_AlignByBlocks
    } from './fsm_Main'`;
        const out = (0, fsm_Main_1.text_AlignByBlocks)(input, fsm_Main_1.DEFAULT_CONFIG.defaultAlignChars);
        assert.strictEqual(out, expected, "Indentation was not preserved correctly");
    });
    it('should be idempotent', () => {
        const input = `export type LanguageRules = {
    lineComments: string[]
    blockComments: { start: string; end: string }[]
    stringDelimiters: string[]
    alignChars: string[]
}`;
        const once = (0, fsm_Main_1.text_AlignByBlocks)(input, fsm_Main_1.DEFAULT_CONFIG.defaultAlignChars);
        const twice = (0, fsm_Main_1.text_AlignByBlocks)(once, fsm_Main_1.DEFAULT_CONFIG.defaultAlignChars);
        assert.strictEqual(twice, once, "Alignment function is not idempotent");
    });
    it('should ignore alignment characters inside strings', () => {
        const input = `
let a = "a:b";
let b = 1;
`;
        const expected = `
let a = "a:b";
let b = 1;
`;
        const out = (0, fsm_Main_1.text_AlignByBlocks)(input, [':']);
        assert.strictEqual(out, expected, "Should not align colon inside a string");
    });
    it('should ignore alignment characters inside comments', () => {
        const input = `
let a = 1; // align: me
let b = 2;
`;
        const expected = `
let a = 1; // align: me
let b = 2;
`;
        const out = (0, fsm_Main_1.text_AlignByBlocks)(input, [':']);
        assert.strictEqual(out, expected, "Should not align colon inside a comment");
    });
    it('should align ?? (nullish coalescing) operator', () => {
        const input = `let a = b ?? 'default'
let longName = short ?? fallback
let xy = z ?? w`;
        const expected = `let a       = b    ?? 'default'
let longName= short?? fallback 
let xy      = z    ?? w        `;
        const out = (0, fsm_Main_1.text_AlignByBlocks)(input, fsm_Main_1.DEFAULT_CONFIG.defaultAlignChars);
        assert.strictEqual(out, expected);
    });
    it('should not align by { anymore', () => {
        const input = `
if (true) {
    let a = {
        b: 1
    };
}
`;
        // With `{` removed from alignChars, nothing should change.
        const out = (0, fsm_Main_1.text_AlignByBlocks)(input, fsm_Main_1.DEFAULT_CONFIG.defaultAlignChars);
        assert.strictEqual(out, input, "Should not align by opening brace");
    });
});
//# sourceMappingURL=engine.test.js.map