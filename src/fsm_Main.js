"use strict";
// ============================================================
// fsm_Main.ts
// Deterministic structural alignment engine
// Idempotent: F(F(x)) = F(x)
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.text_AlignByBlocks = exports.patterns_ToKey = exports.patterns_Find = exports.line_Decompose = exports.languageRules_Detect = exports.DEFAULT_LANGUAGE_RULES = exports.DEFAULT_CONFIG = void 0;
// ── 2. CONFIG ─────────────────────────────────────────────────
exports.DEFAULT_CONFIG = {
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
        '.=',
        ':',
        '=',
        ',',
        '??',
    ],
    defaultSeps: [
        '; ',
        ', ',
    ],
};
// ── 3. LANGUAGE RULES ─────────────────────────────────────────
exports.DEFAULT_LANGUAGE_RULES = {
    lineComments: ['//'],
    blockComments: [{ start: '/*', end: '*/' }],
    stringDelimiters: ['"', "'", '`'],
    alignChars: exports.DEFAULT_CONFIG.defaultAlignChars,
};
function languageRules_Detect(_langId, defaultAlignChars) {
    return {
        ...exports.DEFAULT_LANGUAGE_RULES,
        alignChars: defaultAlignChars,
    };
}
exports.languageRules_Detect = languageRules_Detect;
// ── 4. LINE DECOMPOSITION ─────────────────────────────────────
function line_Decompose(line) {
    let i = 0;
    while (i < line.length &&
        (line[i] === ' ' ||
            line[i] === '\t')) {
        i++;
    }
    return {
        indent: line.slice(0, i),
        body: line.slice(i),
    };
}
exports.line_Decompose = line_Decompose;
// ── 5. DEPTH TRACKING ─────────────────────────────────────────
function depth_Create() {
    return {
        braceDepth: 0,
        parenDepth: 0,
        bracketDepth: 0,
        angleDepth: 0,
    };
}
function depth_IsTopLevel(d) {
    return (d.parenDepth === 0 &&
        d.bracketDepth === 0 &&
        d.angleDepth === 0);
}
function depth_Advance(d, ch) {
    switch (ch) {
        case '{':
            d.braceDepth++;
            return;
        case '}':
            d.braceDepth =
                Math.max(0, d.braceDepth - 1);
            return;
        case '(':
            d.parenDepth++;
            return;
        case ')':
            d.parenDepth =
                Math.max(0, d.parenDepth - 1);
            return;
        case '[':
            d.bracketDepth++;
            return;
        case ']':
            d.bracketDepth =
                Math.max(0, d.bracketDepth - 1);
            return;
        case '<':
            d.angleDepth++;
            return;
        case '>':
            d.angleDepth =
                Math.max(0, d.angleDepth - 1);
            return;
    }
}
// ── 6. MASKING ────────────────────────────────────────────────
function mask_StringsAndComments(line) {
    let State;
    (function (State) {
        State[State["Normal"] = 0] = "Normal";
        State[State["InString"] = 1] = "InString";
        State[State["InEscape"] = 2] = "InEscape";
    })(State || (State = {}));
    let result = '';
    let state = State.Normal;
    let quoteChar = null;
    let i = 0;
    while (i < line.length) {
        const ch = line[i];
        switch (state) {
            case State.Normal:
                // Комментарий?
                if (line.startsWith('//', i)) {
                    result += '\0'.repeat(line.length - i);
                    return result;
                }
                // Обычный символ или начало строки?
                switch (ch) {
                    case '"':
                    case '\'':
                        state = State.InString;
                        quoteChar = ch;
                        result += '\0';
                        i++;
                        break;
                    default:
                        result += ch;
                        i++;
                        break;
                }
                break;
            case State.InString:
                if (ch === '\\') {
                    state = State.InEscape;
                    result += '\0'; // Mask the backslash
                    i++;
                }
                else if (ch === quoteChar) {
                    state = State.Normal;
                    quoteChar = null;
                    result += '\0';
                    i++;
                }
                else {
                    result += '\0';
                    i++;
                }
                break;
            case State.InEscape:
                // The character after '\' is escaped. Mask it and return to InString.
                result += '\0';
                i++;
                state = State.InString;
                break;
        }
    }
    return result;
}
// ── 7. PATTERN MATCHING ───────────────────────────────────────
function pattern_MatchAt(line, pos, patterns) {
    for (const p of patterns) {
        if (line.startsWith(p, pos)) {
            return p;
        }
    }
    return null;
}
function patterns_Find(line, patterns, initialDepth) {
    const masked = mask_StringsAndComments(line);
    const sorted = [...patterns]
        .sort((a, b) => b.length - a.length);
    const depth = initialDepth || depth_Create();
    const result = [];
    let i = 0;
    while (i < masked.length) {
        const matched = pattern_MatchAt(masked, i, sorted);
        if (matched !== null) {
            if (matched === ':' &&
                i + 1 < masked.length &&
                masked[i + 1] === ':') {
                depth_Advance(depth, masked[i]);
                depth_Advance(depth, masked[i + 1]);
                i += 2;
                continue;
            }
            if (matched === '->' &&
                i > 0 &&
                /[a-zA-Z0-9_$]/.test(masked[i - 1])) {
                depth_Advance(depth, masked[i]);
                depth_Advance(depth, masked[i + 1]);
                i += 2;
                continue;
            }
            const isInsideParens = depth.parenDepth > 0;
            if (matched === ':' &&
                !isInsideParens &&
                i > 0 &&
                masked[i - 1] === ')') {
                depth_Advance(depth, masked[i]);
                i++;
                continue;
            }
            if (!depth_IsTopLevel(depth) && !isInsideParens) {
                depth_Advance(depth, masked[i]);
                i++;
                continue;
            }
            result.push({
                pos: i,
                pattern: matched,
            });
            for (const ch of matched) {
                depth_Advance(depth, ch);
            }
            i += matched.length;
            continue;
        }
        depth_Advance(depth, masked[i]);
        i++;
    }
    return result;
}
exports.patterns_Find = patterns_Find;
function patterns_ToKey(pats) {
    return pats
        .map(p => p.pattern)
        .join('\0');
}
exports.patterns_ToKey = patterns_ToKey;
// ── 8. SEPARATORS ─────────────────────────────────────────────
function sep_Find(s, from, seps) {
    let best = null;
    const masked = mask_StringsAndComments(s);
    for (const sep of seps) {
        const idx = masked.indexOf(sep, from);
        if (idx !== -1 &&
            (best === null ||
                idx < best.idx)) {
            best = {
                sep,
                idx,
            };
        }
    }
    return best;
}
// ── 9. SEGMENT PARSING ────────────────────────────────────────
function segment_Parse(line, from, to, seps) {
    const raw = line
        .slice(from, to)
        .trim();
    const found = sep_Find(raw, 0, seps);
    if (found === null) {
        return {
            key: '',
            val: raw,
            sep: '',
            after: '',
        };
    }
    return {
        key: '',
        val: raw
            .slice(0, found.idx)
            .trim(),
        sep: found.sep,
        after: raw
            .slice(found.idx + found.sep.length)
            .trim(),
    };
}
function segments_OfLine(line, pats, count, seps) {
    const result = [];
    let endPrev = 0;
    for (let j = 0; j < count; j++) {
        const pat = pats[j];
        const key = line
            .slice(endPrev, pat.pos)
            .trim();
        const anchor = pat.pattern;
        endPrev =
            pat.pos +
                pat.pattern.length;
        const nextPos = j + 1 < count
            ? pats[j + 1].pos
            : line.length;
        const seg = segment_Parse(line, endPrev, nextPos, seps);
        endPrev = nextPos;
        result.push({
            key,
            anchor,
            val: seg.val,
            sep: seg.sep,
            after: seg.after,
            tail: '',
        });
    }
    if (result.length > 0) {
        result[result.length - 1].tail =
            line.slice(endPrev);
    }
    return result;
}
// ── 10. WIDTHS ────────────────────────────────────────────────
function widths_Measure(lines, patterns_PerLine, count, seps) {
    const widths_Key = new Array(count).fill(0);
    const widths_Val = new Array(count).fill(0);
    for (let r = 0; r < lines.length; r++) {
        const segs = segments_OfLine(lines[r].body, patterns_PerLine[r], count, seps);
        for (let j = 0; j < count; j++) {
            widths_Key[j] =
                Math.max(widths_Key[j], segs[j].key.length);
            widths_Val[j] =
                Math.max(widths_Val[j], segs[j].val.length);
        }
    }
    return {
        widths_Key,
        widths_Val,
    };
}
// ── 11. RENDER ────────────────────────────────────────────────
function segment_Render(seg, width_Key, width_Val, is_Last, singlePat = false) {
    const keyPad = singlePat ? width_Key + 1 : width_Key;
    const rendered = seg.key.padEnd(keyPad) +
        ' ' +
        seg.anchor +
        ' ' +
        seg.val.padEnd(width_Val) +
        seg.sep +
        seg.after;
    return is_Last
        ? rendered + seg.tail
        : rendered;
}
function line_Render(line, pats, count, widths_Key, widths_Val, seps, singlePat = false) {
    const segs = segments_OfLine(line, pats, count, seps);
    return segs
        .map((seg, j) => segment_Render(seg, widths_Key[j], widths_Val[j], j === count - 1, singlePat))
        .join('');
}
// ── 12. BLOCK PROCESSING ──────────────────────────────────────
function block_Process(indices, lines_All, patterns, seps) {
    const lines = indices.map(i => lines_All[i]);
    if (indices.length === 1) {
        return lines;
    }
    const decomposed = lines.map(line_Decompose);
    let depth = depth_Create();
    const patterns_PerLine = decomposed.map(d => {
        const pats = patterns_Find(d.body, patterns, depth);
        for (let i = 0; i < d.body.length; i++) {
            depth_Advance(depth, d.body[i]);
        }
        return pats;
    });
    const hasPats = patterns_PerLine.some(p => p.length > 0);
    if (!hasPats) {
        return lines;
    }
    const linesWithPats = [];
    const patsWithPats = [];
    patterns_PerLine.forEach((pats, i) => {
        if (pats.length > 0) {
            linesWithPats.push(i);
            patsWithPats.push(pats);
        }
    });
    const patCounts = patsWithPats.map(p => p.length);
    const count = Math.min(...patCounts);
    const allSingle = patCounts.every(c => c === 1);
    const hasMultiCharPat = patsWithPats.some(p => p[0].pattern.length > 1);
    const singlePat = allSingle && hasMultiCharPat;
    function commonAnchorCount(allPats) {
        if (allPats.length === 0) {
            return 0;
        }
        const first = allPats[0];
        let count = 0;
        for (let i = 0; i < first.length; i++) {
            const anchor = first[i].pattern;
            if (allPats.every(p => p[i]?.pattern === anchor)) {
                count++;
            }
            else {
                break;
            }
        }
        return count;
    }
    const anchorCount = commonAnchorCount(patsWithPats);
    if (anchorCount === 0) {
        return lines;
    }
    const linesWithPatsBodies = linesWithPats.map(i => decomposed[i]);
    const { widths_Key, widths_Val, } = widths_Measure(linesWithPatsBodies, patsWithPats, anchorCount, seps);
    const result = [...lines];
    patsWithPats.forEach((pats, idx) => {
        const origIdx = linesWithPats[idx];
        const line = decomposed[origIdx];
        const rendered = line_Render(line.body, pats, anchorCount, widths_Key, widths_Val, seps, singlePat);
        result[origIdx] = line.indent + rendered;
    });
    return result;
}
function blockState_FlushCurrent(state) {
    if (state.block_Current.length === 0) {
        return state;
    }
    return {
        blocks: [
            ...state.blocks,
            state.block_Current,
        ],
        block_Current: [],
        key_Current: null,
        prevParenDepth: state.prevParenDepth,
        prevBraceDepth: state.prevBraceDepth,
        prevBracketDepth: state.prevBracketDepth,
    };
}
function blockState_OnEmpty(state) {
    return blockState_FlushCurrent(state);
}
function commonPrefix(a, b) {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) {
        i++;
    }
    return a.slice(0, i);
}
function blockState_OnLine(state, i, key, parenDepth, braceDepth, bracketDepth) {
    const prefix = commonPrefix(key, state.key_Current || '');
    const parenDepthDecreased = parenDepth < state.prevParenDepth;
    const bracketDepthDecreased = bracketDepth < state.prevBracketDepth;
    const prevEndsWithBrace = state.key_Current?.includes('{');
    const braceDepthDecreased = braceDepth < (state.prevBraceDepth || 0);
    const firstAnchorOf = (k) => k.split('\0')[0] || '';
    const currentFirst = firstAnchorOf(key);
    const prevFirst = firstAnchorOf(state.key_Current || '');
    const firstAnchorsMatch = currentFirst === prevFirst && currentFirst !== '';
    const prevEndsWithOpenBrace = (state.key_Current || '').endsWith('{');
    const prevHasEqualsAssignment = (state.key_Current || '').includes('=');
    const currentHasColonOnly = key.includes(':') && !key.includes('=');
    const isTopLevel = parenDepth === 0 && (state.prevParenDepth || 0) === 0;
    const isInsideSomething = state.prevParenDepth > 0 || state.prevBracketDepth > 0;
    const shouldSplitFromAssignment = prevHasEqualsAssignment && currentHasColonOnly && isTopLevel;
    const shouldMerge = firstAnchorsMatch &&
        !shouldSplitFromAssignment &&
        !parenDepthDecreased &&
        !braceDepthDecreased &&
        !bracketDepthDecreased &&
        !prevEndsWithBrace &&
        (isInsideSomething || parenDepth >= 0);
    if (shouldMerge) {
        return {
            ...state,
            block_Current: [
                ...state.block_Current,
                i,
            ],
            prevParenDepth: parenDepth,
            prevBraceDepth: braceDepth,
            prevBracketDepth: bracketDepth,
        };
    }
    const flushed = blockState_FlushCurrent(state);
    return {
        ...flushed,
        block_Current: [i],
        key_Current: key,
        prevParenDepth: parenDepth,
        prevBraceDepth: braceDepth,
        prevBracketDepth: bracketDepth,
    };
}
function blocks_Split(lines_All, patterns) {
    let state = {
        blocks: [],
        block_Current: [],
        key_Current: null,
        prevParenDepth: 0,
        prevBraceDepth: 0,
        prevBracketDepth: 0,
    };
    let cumulativeDepth = depth_Create();
    for (let i = 0; i < lines_All.length; i++) {
        const line = lines_All[i];
        if (line.trim() === '') {
            state = blockState_OnEmpty(state);
            // Reset depth for the next block
            cumulativeDepth = depth_Create();
            // Also reset prev depths in state for blockState_OnLine logic
            state.prevParenDepth = 0;
            state.prevBraceDepth = 0;
            state.prevBracketDepth = 0;
            continue;
        }
        const decomposed = line_Decompose(line);
        // Pass the cumulative depth state to patterns_Find. 
        // It will be updated to reflect the depth at the end of the current line.
        const patternsOnLine = patterns_Find(decomposed.body, patterns, cumulativeDepth);
        const key = patterns_ToKey(patternsOnLine);
        // Now cumulativeDepth is the depth at the end of the current line.
        // The old depths are still in `state.prev...Depth`.
        state = blockState_OnLine(state, i, key, cumulativeDepth.parenDepth, cumulativeDepth.braceDepth, cumulativeDepth.bracketDepth);
        // Update the state's `prev` depths for the *next* line's comparison.
        state.prevParenDepth = cumulativeDepth.parenDepth;
        state.prevBraceDepth = cumulativeDepth.braceDepth;
        state.prevBracketDepth = cumulativeDepth.bracketDepth;
    }
    return blockState_FlushCurrent(state).blocks;
}
// ── 14. ENTRY POINT ───────────────────────────────────────────
function text_AlignByBlocks(input, patterns, seps = exports.DEFAULT_CONFIG.defaultSeps) {
    const lines_All = input.split('\n');
    const blocks = blocks_Split(lines_All, patterns);
    const lines_Result = [...lines_All];
    for (const block of blocks) {
        const aligned = block_Process(block, lines_All, patterns, seps);
        for (let idx = 0; idx < block.length; idx++) {
            lines_Result[block[idx]] =
                aligned[idx];
        }
    }
    return lines_Result.join('\n');
}
exports.text_AlignByBlocks = text_AlignByBlocks;
//# sourceMappingURL=fsm_Main.js.map