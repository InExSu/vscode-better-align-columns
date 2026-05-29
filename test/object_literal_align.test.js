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
const sourceCode = `function fn_AutoSearchIndent() {
    let z = 1
    let pq = { start: 0, end: 0 }
    return { startLine: 0, endLine: 0 }
}`;
const expectedOutput = "function fn_AutoSearchIndent() {\n    let z = 1         \n    let pq= { start: 0, end: 0 }\n    return { startLine: 0, endLine: 0 }\n}";
describe('Align object literal colon', () => {
    it('should NOT align colon in return to colon in object literal above', () => {
        const alignedContent = (0, fsm_Main_1.text_AlignByBlocks)(sourceCode, fsm_Main_1.DEFAULT_CONFIG.defaultAlignChars);
        assert.strictEqual(alignedContent, expectedOutput, `Output does not match expected.\nGot:\n${alignedContent}\nExpected:\n${expectedOutput}`);
    });
});
//# sourceMappingURL=object_literal_align.test.js.map