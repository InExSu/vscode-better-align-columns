"use strict";
// ============================================================
// Code.Align.Columns — VS Code Extension
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fsm_Main_1 = require("./fsm_Main");
// ── CONFIG ──────────────────────────────────────────────────
const CONFIG = {
    ...fsm_Main_1.DEFAULT_CONFIG,
};
function fn_AutoSearchIndent(ctx) {
    ctx.activeLine = ctx.selection.active.line;
    ctx.initialIndent = ctx.doc.lineAt(ctx.activeLine).text.match(/^\s*/)?.[0] ?? '';
    const i_Up = scanUp(ctx);
    const i_Down = scanDown(ctx);
    if (i_Up === null || i_Down === null) {
        return null;
    }
    return { startLine: i_Up, endLine: i_Down };
}
function scanUp(ctx) {
    let i_Line = ctx.activeLine;
    while (i_Line > 0) {
        const o_Prev = ctx.doc.lineAt(i_Line - 1);
        if (o_Prev.isEmptyOrWhitespace) {
            break;
        }
        if ((o_Prev.text.match(/^\s*/)?.[0] ?? '') !== ctx.initialIndent) {
            break;
        }
        i_Line--;
    }
    return i_Line;
}
function scanDown(ctx) {
    let i_Line = ctx.activeLine;
    const i_Last = ctx.doc.lineCount - 1;
    while (i_Line < i_Last) {
        const o_Next = ctx.doc.lineAt(i_Line + 1);
        if (o_Next.isEmptyOrWhitespace) {
            break;
        }
        if ((o_Next.text.match(/^\s*/)?.[0] ?? '') !== ctx.initialIndent) {
            break;
        }
        i_Line++;
    }
    return i_Line;
}
function findBlockRange(editor) {
    const ctx = {
        editor,
        doc: editor.document,
        selection: editor.selection,
        initialIndent: '',
        activeLine: 0,
    };
    if (ctx.selection.isEmpty) {
        const range = fn_AutoSearchIndent(ctx);
        if (!range) {
            return null;
        }
        return new vscode.Range(new vscode.Position(range.startLine, 0), new vscode.Position(range.endLine, ctx.doc.lineAt(range.endLine).text.length));
    }
    return new vscode.Range(ctx.selection.start, ctx.selection.end);
}
// ── MAIN ALIGNMENT LOGIC ────────────────────────────────────
function runAlign() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor.');
        return;
    }
    try {
        const o_VsConfig = vscode.workspace.getConfiguration('betterAlignColumns');
        const config = {
            ...CONFIG,
            defaultAlignChars: o_VsConfig.get('defaultAlignChars', CONFIG.defaultAlignChars),
            // other configs can be loaded here if needed by fsm_Main
        };
        const rules = (0, fsm_Main_1.languageRules_Detect)(editor.document.languageId, config.defaultAlignChars);
        const rangeToAlign = findBlockRange(editor);
        if (!rangeToAlign) {
            vscode.window.showInformationMessage('No block to align.');
            return;
        }
        const textToAlign = editor.document.getText(rangeToAlign);
        const alignedText = (0, fsm_Main_1.text_AlignByBlocks)(textToAlign, rules.alignChars, CONFIG.defaultSeps);
        if (textToAlign !== alignedText) {
            editor.edit(editBuilder => {
                editBuilder.replace(rangeToAlign, alignedText);
            }).then(success => {
                if (success) {
                    vscode.window.showInformationMessage('Code aligned successfully.');
                }
                else {
                    vscode.window.showErrorMessage('Failed to apply alignment.');
                }
            });
        }
        else {
            vscode.window.showInformationMessage('Code is already aligned.');
        }
    }
    catch (e) {
        vscode.window.showErrorMessage(`Code.Align Error: ${e.message}`);
    }
}
// ── EXTENSION ACTIVATION ───────────────────────────────────
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('vscode-better-align-columns.align', runAlign), 
    // The old command is kept for compatibility
    vscode.commands.registerCommand('CodeAlign.AlignBlock', runAlign), vscode.commands.registerCommand('CodeAlign.Configure', () => vscode.commands.executeCommand('workbench.action.openSettings', 'betterAlignColumns')));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map