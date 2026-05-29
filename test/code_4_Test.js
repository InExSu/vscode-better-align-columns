"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LANGUAGE_RULES = void 0;
exports.DEFAULT_LANGUAGE_RULES = {
    lineComments: ['//'],
    blockComments: [],
    stringDelimiters: [],
    alignChars: []
};
const state = {
    key_Current: '',
    prevBraceDepth: 0
};
const braceDepth = 0; // или другое значение
const prevEndsWithBrace = state.key_Current.includes('{');
const braceDepthDecreased = braceDepth < (state.prevBraceDepth ?? 0);
{
    let x = 1;
    let longName = 2;
    if (x === 1) { }
    if (longName === 2) { }
    if (x === 1) { }
    function fn_AutoSearchIndent() {
        let z = 1;
        let pq = { start: 0, end: 0 };
        return { startLine: 0, endLine: 0 };
    }
    function test1(str1, s2) {
        return str1 + s2;
    }
    let t1 = {
        z: test1('1', ''),
        y: test1('333', ''),
    };
    let z = {
        s1: test1('maxBlockSize', ''),
        preserveComments: test1('preserveComments', ''),
    };
}
//# sourceMappingURL=code_4_Test.js.map