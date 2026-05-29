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
const sourceCode = `function fn_AutoSearchIndent(ctx: BlockSearchContext): { startLine: number; endLine: number } | null {
    ctx.activeLine = ctx.selection.active.line
    ctx.initialIndent = ctx.doc.lineAt(ctx.activeLine).text.match(/^\s*/)?.[0] ?? ''
    const up = scanUp(ctx); if(up === null) { return null } ctx.startLine = up
    const down = scanDown(ctx); if(down === null) { return null } ctx.endLine = down
    return { startLine: ctx.startLine, endLine: ctx.endLine }
}`;
const expectedOutput = "function fn_AutoSearchIndent(ctx: BlockSearchContext): { startLine: number; endLine: number } | null {\n    ctx.activeLine   = ctx.selection.active.line                                  \n    ctx.initialIndent= ctx.doc.lineAt(ctx.activeLine).text.match(/^s*/)?.[0] ?? ''\n    const up         = scanUp(ctx)                                                ; if(up === null) { return null } ctx.startLine = up\n    const down       = scanDown(ctx)                                              ; if(down === null) { return null } ctx.endLine = down\n    return { startLine: ctx.startLine, endLine: ctx.endLine }\n}";
describe('Align return type colon', () => {
    it('should NOT align colon in return statement to return type colon in function signature', () => {
        const alignedContent = (0, fsm_Main_1.text_AlignByBlocks)(sourceCode, fsm_Main_1.DEFAULT_CONFIG.defaultAlignChars);
        assert.strictEqual(alignedContent, expectedOutput);
    });
});
//# sourceMappingURL=return_type_align.test.js.map