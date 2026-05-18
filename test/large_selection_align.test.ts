import * as assert from 'assert'
import { text_AlignByBlocks, DEFAULT_CONFIG } from '../src/fsm_Main'

const sourceCode = `function pattern_MatchAt(
    line: string,
    pos: number,
    patterns: Pattern[]
): string | null {
    return null
}`

const expectedOutput = "function pattern_MatchAt(\n    line    : string,  \n    pos     : number,  \n    patterns: Pattern[]\n): string | null {\n    return null\n}"

describe('Align large selection', () => {
    it('should align when entire function is selected', () => {
        const alignedContent = text_AlignByBlocks(sourceCode, DEFAULT_CONFIG.defaultAlignChars)

        assert.strictEqual(alignedContent, expectedOutput,
            `Output does not match expected.\nGot:\n${alignedContent}\nExpected:\n${expectedOutput}`)
    })
})