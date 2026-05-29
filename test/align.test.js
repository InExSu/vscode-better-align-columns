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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const assert = __importStar(require("assert"));
const fsm_Main_1 = require("../src/fsm_Main");
describe('Align code_4_Test.ts', () => {
    it('should align code_4_Test.ts and save to code_Aligned.ts', () => {
        const sourcePath = path.resolve(__dirname, 'code_4_Test.ts');
        const sourceCode = fs.readFileSync(sourcePath, 'utf-8');
        const alignedContent = (0, fsm_Main_1.text_AlignByBlocks)(sourceCode, fsm_Main_1.DEFAULT_CONFIG.defaultAlignChars);
        const outputPath = path.resolve(__dirname, 'code_Aligned.ts');
        fs.writeFileSync(outputPath, alignedContent, 'utf-8');
        const filesDiffer = sourceCode !== alignedContent;
        console.log(`Files differ: ${filesDiffer}`);
        if (!filesDiffer) {
            console.log('Original:');
            console.log(sourceCode);
            console.log('Aligned:');
            console.log(alignedContent);
        }
        assert.ok(filesDiffer, 'code_Aligned.ts must differ from code_4_Test.ts - alignment did not work');
    });
});
describe('Double colon :: should not be split', () => {
    it('should keep :: together and not add spaces between $ns and ->', () => {
        const input = `    match ($ns->s_FTP_From) {
        FTP_From::FTP  => FTP_Files_Read($ns),
        FTP_From::Local=> Local_Files_Read($ns),
        FTP_From::B24  => $ns->FTP_Files_Read = [],
    };`;
        const aligned = (0, fsm_Main_1.text_AlignByBlocks)(input, fsm_Main_1.DEFAULT_CONFIG.defaultAlignChars);
        assert.ok(!aligned.includes(': :'), 'Should not split :: into : :');
        assert.ok(!aligned.includes('$ns  ->'), 'Should not add spaces between $ns and ->');
        assert.ok(aligned.includes('$ns->'), 'Should keep $ns-> together');
        assert.ok(aligned.includes('FTP_From::'), 'Should keep :: together');
    });
    it('should not align $ns with -> when anchors differ (comma vs equals)', () => {
        const input = `    match ($ns->s_FTP_From) {
        FTP_From::FTP  => FTP_Files_Read($ns)  ,
        FTP_From::Local=> Local_Files_Read($ns),
        FTP_From::B24  => $ns->FTP_Files_Read = [],
    };`;
        const aligned = (0, fsm_Main_1.text_AlignByBlocks)(input, fsm_Main_1.DEFAULT_CONFIG.defaultAlignChars);
        assert.ok(!aligned.includes('$ns                  ->'), 'Should not split $ns from ->');
        assert.ok(aligned.includes('$ns->FTP_Files_Read'), 'Should keep $ns->FTP_Files_Read together');
        const lines = aligned.split('\n');
        const b24Line = lines.find(l => l.includes('B24'));
        assert.ok(b24Line?.includes('$ns->'), 'B24 line should have $ns-> without spaces');
    });
});
//# sourceMappingURL=align.test.js.map