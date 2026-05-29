
import * as assert from 'assert';
import { text_AlignByBlocks, DEFAULT_CONFIG } from '../src/fsm_Main';

describe('Const Assignment Alignment Test Suite', () => {
    it('Should align const assignments', () => {
        const unalignedCode = `const env = l
const op = e
const ric = Y`;
        const alignedCode = `const env = l
const op  = e
const ric = Y`;

        const result = text_AlignByBlocks(unalignedCode, DEFAULT_CONFIG.defaultAlignChars);
        assert.strictEqual(result, alignedCode, `Output does not match expected.
Got:
${result}
Expected:
${alignedCode}`);
    });
});
