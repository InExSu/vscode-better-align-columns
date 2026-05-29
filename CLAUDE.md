# AI Assistant Guide for vscode-better-align-columns

This document provides guidance for an AI assistant (like Claude, Gemini, etc.) to understand and contribute to this project.

## 1. Project Overview

This is a VS Code extension that provides powerful vertical code alignment. Its core philosophy is to perform this alignment deterministically and intelligently, understanding code structure like nesting and comments.

## 2. Core Architecture

The project is split into two main parts:

-   **`src/extension.ts` (The "Shell"):** This is the entry point that interacts with the VS Code API.
    -   It registers commands (`vscode-better-align-columns.align`).
    -   It reads user configuration (`vscode.workspace.getConfiguration`).
    -   It determines the range of text to be aligned (either the user's selection or by auto-detecting a block).
    -   It calls the core engine with the text and configuration.
    -   It applies the returned aligned text back to the editor.

-   **`src/fsm_Main.ts` (The "Engine"):** This is the pure, core logic for alignment.
    -   **It has zero dependencies on the `vscode` API.** It's a pure function that transforms a string input into a string output.
    -   This is where all the complex alignment logic, pattern matching, and block splitting happens.
    -   When fixing alignment bugs or adding features, this is almost always the file you will modify.

## 3. Alignment Engine Workflow (`fsm_Main.ts`)

The alignment process is as follows:

1.  **`text_AlignByBlocks(input: string, ...)`**: The main entry function.
2.  **`blocks_Split(...)`**: This is a critical step. It intelligently splits the entire input text into smaller, independent "blocks" of lines that should be aligned together.
    -   It splits by empty lines.
    -   It uses bracket/brace/parenthesis depth (`[]`, `{}`, `()`) to keep nested structures together in the same block.
    -   **Note:** A recent fix was made here to correctly track bracket depth (`[]`) to handle multi-line arrays.
3.  **`block_Process(...)`**: This function orchestrates the alignment for a single block.
4.  **`patterns_Find(...)`**: For each line in a block, this finds all occurrences of alignment patterns (like `=`, `:`, `,`), creating a "key" for the line's structure. It's smart enough to ignore patterns inside strings and comments.
5.  **`segments_OfLine(...)`**: Decomposes a line into its constituent parts: `key` (text before the anchor), `anchor` (the operator), and `val` (text after the anchor).
6.  **`widths_Measure(...)`**: Calculates the maximum width needed for each "column" (`key`, `val`) across all lines in the block.
7.  **`line_Render(...)` & `segment_Render(...)`**: Reconstructs each line, using the calculated widths to add the correct amount of padding and produce the final, aligned text.

## 4. Key Principles & Conventions

-   **Idempotency**: The engine must be idempotent. Running alignment on already-aligned code should produce no changes. `Align(Align(code)) == Align(code)`.
-   **Purity**: `fsm_Main.ts` must remain pure. Do not introduce any `vscode` imports or side effects into this file.
-   **TDD (Test-Driven Development)**: All bug fixes and new features must be accompanied by tests.
    -   Create a new file in `test/` (e.g., `test/my_new_feature.test.ts`).
    -   Use the `describe()` and `it()` structure from `mocha`.
    -   Write a test that reproduces the bug or tests the new feature, and confirm it fails.
    -   Implement the fix/feature in `src/fsm_Main.ts`.
    -   Run tests until they all pass.

## 5. Development Workflow

-   **Install Dependencies**: `npm install`
-   **Run Tests**: `npm test`
    -   **IMPORTANT:** The test runner (`ts-mocha`) has shown issues with caching. If your changes don't seem to be reflected in test runs, force a clean build:
        ```bash
        rm -rf out dist && npm run compile && npm test
        ```
-   **Build for Production**: `npm run package`
-   **Create VSIX Package**: `npx vsce package`
-   **Install Locally**: `code --install-extension vscode-better-align-columns-VERSION.vsix`

## 6. AI Prompting Guide

**Good Prompt Example (Bug Fix):**

> The following code is not aligning correctly.
> **Before:**
> ```javascript
> let a = 1;
> let abc= 2;
> ```
> **After (Incorrect):**
> ```javascript
> let a= 1;
> let abc= 2;
> ```
> **Expected Output:**
> ```javascript
> let a   = 1;
> let abc = 2;
> ```
> Create a new test case named `test/assignment_spacing.test.ts` that reproduces this failure. Then, fix the logic in `src/fsm_Main.ts` to produce the correct output.

**Good Prompt Example (Feature):**

> I want to add support for aligning by the `~=` operator in Elixir. Add `~=` to the `defaultAlignChars` array in `src/fsm_Main.ts`. Then, create a new test file `test/elixir_tilde_equals.test.ts` with a test case that shows this new operator being correctly aligned.
