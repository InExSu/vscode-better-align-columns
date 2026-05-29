
import * as assert from 'assert';
import { text_AlignByBlocks, DEFAULT_CONFIG } from '../src/fsm_Main';

describe('Multi-line Array Alignment Test Suite', () => {
    it('Should align commas in a multi-line array', () => {
        const unalignedCode = `
    defaultAlignChars: [
        '===',
        '!==',
        '<=>',
        '=>',
        '->',
        '==',
        '!=',
        '>=',
        '<=',
        '+=',
        '-=',
        '*=',
        '/=',
        '%=',
        '**=',
        ':',
        '=',
        ',',
        '??',
    ],
`;

        const expectedAlignedCode = `
    defaultAlignChars: [
        '===' ,
        '!==' ,
        '<=>' ,
        '=>'  ,
        '->'  ,
        '=='  ,
        '!='  ,
        '>='  ,
        '<='  ,
        '+='  ,
        '-='  ,
        '*='  ,
        '/='  ,
        '%='  ,
        '**=' ,
        ':'   ,
        '='   ,
        ','   ,
        '??'  ,
    ],
`;

        const result = text_AlignByBlocks(unalignedCode, DEFAULT_CONFIG.defaultAlignChars);
        assert.strictEqual(result.trim(), expectedAlignedCode.trim(), `Output does not match expected.
Got:
${result}
Expected:
${expectedAlignedCode}`);
    });
});
