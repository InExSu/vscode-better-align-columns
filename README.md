# Better Align Columns

**Better Align Columns** is a Visual Studio Code extension for vertically aligning code by operators and delimiters. It helps improve code readability by neatly organizing your code into columns, whether you're working with variable assignments, object properties, or other structured code.

It works with or without a selection, intelligently detecting code blocks based on indentation and context.

![Better Align Columns Demo](https://raw.githubusercontent.com/inexsu/vscode-better-align-columns/master/img/animation.gif)
*(Image: A demonstration of the alignment feature)*

---

## Features

- **Context-Aware Alignment**: Intelligently aligns code even without a selection by detecting contiguous code blocks.
- **Selection-Based Alignment**: Restricts alignment to only the lines you have selected.
- **Multi-Pattern Support**: Aligns a wide variety of operators and delimiters in a single operation, including `=`, `==`, `===`, `=>`, `:`, `,`, `+=`, `*=`, and more.
- **Smart Masking**: Correctly ignores operators and delimiters found inside strings (`"`, `'`, `` ` ``), comments (`//`, `/* ... */`), and other contexts where they shouldn't be aligned.
- **Depth-Aware Engine**: Respects code structure by handling nested parentheses `()`, brackets `[]`, and braces `{}`.
- **Idempotent**: Applying alignment multiple times to the same block of code produces the same result.
- **Web Compatible**: Fully functional in web-based editors like `vscode.dev` and `github.dev`.

## Usage

1.  Place your cursor within a block of code you want to align, or select multiple lines.
2.  Open the Command Palette (`Shift+Command+P` on macOS, `Ctrl+Shift+P` on Windows) and type **`Align`**.
3.  Select the `Align` command to format the block.

Alternatively, use the default keybinding.

### Default Keybinding

-   **macOS**: `alt+a`
-   **Windows/Linux**: `alt+a`

## Example

**Before:**
```javascript
const env = l
const op = e
const ric = Y
let a = 1;
let longerVar = 2;
```

**After:**
```javascript
const env     = l 
const op      = e 
const ric     = Y 
let a         = 1;
let longerVar = 2;
```

## Configuration

You can customize the extension's behavior by modifying your `settings.json` file or through the VS Code Settings UI. Search for "Better Align".

| Setting | Description | Default Value |
|---------|-------------|---------------|
| `betterAlignColumns.operatorPadding` | Controls where to insert space to align operators of different lengths (e.g., `=`, `+=`). Can be `left` or `right`. | `"right"` |
| `betterAlignColumns.surroundSpace` | Defines how many spaces to insert around specific operators like colons, assignments, and arrows. | `{"colon": [0,1], "assignment": [1,1], ...}` |
| `betterAlignColumns.indentBase` | Determines how indentation is handled across the aligned block. `firstline` (all lines adopt the first line's indent), `activeline` (use the active line's indent), or `dontchange`. | `"firstline"` |
| `betterAlignColumns.alignAfterTypeEnter` | If set to `true`, automatically aligns the current block after you press Enter. | `false` |
| `betterAlignColumns.languageConfigs` | Define language-specific comment styles for languages not supported by default. | `{}` |

## Development

To get started with developing this extension locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/InExSu/vscode-better-align-columns.git
    cd vscode-better-align-columns
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run Tests:**
    To ensure everything is working correctly, run the test suite:
    ```bash
    npm test
    ```

4.  **Package the Extension:**
    To create a `.vsix` package for local installation:
    ```bash
    npm run package
    npx vsce package
    ```

5.  **Install Locally:**
    You can install the packaged `.vsix` file from the command line:
    ```bash
    code --install-extension vscode-better-align-columns-VERSION.vsix
    ```

---

Enjoy cleaner, more readable code!
