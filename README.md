# Better Align Columns

VS Code extension for vertical alignment of code columns — operators, delimiters, assignments — with or without selection.

## Features

- **Works without selection** — auto-detects a contiguous code block by indentation level
- **With selection** — aligns only the selected lines
- **Multi-pattern alignment** — aligns `=`, `==`, `===`, `=>`, `:`, `,`, `+=`, `-=`, `*=` and more in one pass
- **Smart masking** — ignores content inside strings (`"`, `'`, `` ` ``) and line comments (`//`)
- **Depth-aware** — respects parentheses, brackets, and brace nesting, skipping patterns inside them
- **Block splitting** — separates unrelated groups of lines so they align independently
- **Idempotent** — applying alignment twice produces the same result: `F(F(x)) = F(x)`
- **Web extension** — works on vscode.dev and github.dev

## Usage

1. Place cursor on a block of code (or select lines) or select all code.
2. Press the key combination alt+a OR run vs code command (Shift+Command+P): **Align** (or `CodeAlign.AlignBlock` for backward compatibility)
3. Operators and delimiters are aligned vertically within the block

Or open settings → search `betterAlignColumns`.

## Commands

| Command | Title |
|---------|-------|
| `vscode-better-align-columns.align` | Align |
| `CodeAlign.AlignBlock` | Align (legacy) |
| `CodeAlign.Configure` | Open settings |

## Configuration

| Key | Default | Description |
|-----|---------|-------------|
| `betterAlignColumns.defaultAlignChars` | `["===", "!==", "<=>", "=>", "->", "==", "!=", ">=", "<=", "+=", "-=", "*=", "/=", "%= ..."]` | Operators/patterns to align |
| `betterAlignColumns.languageConfigs` | `{}` | Per-language comment syntax (line/block comments) |


