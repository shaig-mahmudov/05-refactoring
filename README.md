# Lab 05: ES Modules Refactoring the Token Counter 🗂️

## Introduction

In Lab 04 you built a live token counter. It works. But every line of code utility functions, history management, and DOM logic lives inside a single file: `tokenCounter.js`. As projects grow, this becomes a serious problem. A 50-line file is easy to read. A 500-line file is not. A 5,000-line file is a liability.

**Refactoring** is the practice of restructuring existing code without changing what it does. It is one of the most important skills in software development, and it is also one of the areas where AI tools are least reliable. An AI assistant can write new features quickly, but reorganising existing code correctly requires a deep understanding of what depends on what and AI often gets this wrong in subtle ways that introduce hard-to-spot bugs. In this lab, that responsibility is yours.

You will split `tokenCounter.js` into three focused modules:

- `utils.js` pure text-processing functions with no dependencies
- `history.js` snapshot history state and management
- `dom.js` DOM queries and event listeners

By the end, the token counter will behave exactly as before. But the code will be organised, readable, and ready to grow.

<br>

## Learning Objectives

By the end of this lab you will be able to:

- Explain what an ES Module is and why modules exist
- Use `export` to make a function or variable available to other files
- Use `import` to bring exported items into another file
- Add `type="module"` to a `<script>` tag
- Trace dependencies between modules and identify what needs to be imported where
- Use VS Code Live Server to run a local development server (required for ES Modules)
- Verify a refactor is correct by testing every feature manually in the browser

<br>

## Getting Started

### Previous work

You are continuing in the same project. No new repository needed. Open your existing `tokenCounter.html` and `tokenCounter.js` files from Lab 04 those are your starting point.

> **Before you write a single line of code, read all of Part 1.** Understanding the module system conceptually will save you significant debugging time later.

<br>

## Part 1: Understanding ES Modules

### What is a module?

A **module** is a JavaScript file that explicitly declares what it shares with the outside world and what it needs from other files. Nothing leaks in or out by accident. Variables declared in a module are scoped to that file they do not end up on the global `window` object.

There are two keywords:

- `export` marks a function or variable as available to other modules
- `import` brings something exported by another module into the current file

<br>

### Named exports

The most common pattern is a **named export**:

```js
// utils.js
export function cleanText(text) {
  return text.trim();
}

export function splitIntoWords(text) {
  return text.split(' ');
}
```

Each function is exported individually by name. You can have as many named exports as you like in one file.

<br>

### Named imports

To use those functions in another file:

```js
// dom.js
import { cleanText, splitIntoWords } from './utils.js';
```

Two things to notice:
1. The names inside `{}` must match **exactly** what was exported capitalisation matters
2. The path must start with `./` JavaScript will not resolve bare names like `'utils.js'` on its own

<br>

### The script tag

For the browser to treat a file as a module, the `<script>` tag that loads it must include `type="module"`:

```html
<script type="module" src="dom.js"></script>
```

Without this attribute, `import` and `export` are syntax errors.

<br>

### ⚠️ Important: modules require a local server

ES Modules do **not** work when you open an HTML file directly from your filesystem (the URL will start with `file://`). You will see a CORS error in the console and nothing will load.

You need to serve the files over HTTP. The easiest way in VS Code is the **Live Server** extension:

1. Right-click `tokenCounter.html` in the file explorer
2. Select **Open with Live Server**
3. The page opens at something like `http://127.0.0.1:5500/tokenCounter.html`

If Live Server is not installed, find it in the Extensions panel (`Ctrl+Shift+X`) and install it before continuing.

<br>

## Part 2: Planning the Split

Before creating any new files, you need to understand what depends on what. Open `tokenCounter.js` and read through it carefully.

<br>

### Step 1: Map your functions

List every function in `tokenCounter.js` and decide which module it belongs to. Use this table as a guide:

| Name | Where it lives now | Where it will go |
|---|---|---|
| `cleanText` | `tokenCounter.js` | ? |
| `splitIntoWords` | `tokenCounter.js` | ? |
| `removeEmptyWords` | `tokenCounter.js` | ? |
| `estimateTokens` | `tokenCounter.js` | ? |
| `countTokens` | `tokenCounter.js` | ? |
| `analyzeText` | `tokenCounter.js` | ? |
| `renderHistory` | `tokenCounter.js` | ? |
| `history` array | `tokenCounter.js` | ? |
| DOM selectors | `tokenCounter.js` | ? |
| Event listeners | `tokenCounter.js` | ? |

Apply this rule to each item:

- **Does it touch `document`?** → `dom.js`
- **Does it manage the `history` array?** → `history.js`
- **Does it only transform text or numbers, with no side effects?** → `utils.js`

Fill in the column before writing any code.

<br>

### Step 2: Draw the dependency graph

Now figure out which files will need to import from which. Answer these questions:

- Does `history.js` need anything from `utils.js`?
- Does `dom.js` need anything from `utils.js`?
- Does `dom.js` need anything from `history.js`?
- Does `utils.js` need anything from anyone?

Sketch it out on paper or as a comment block. One rule to keep in mind: **a module should never import from a file that imports from it.** Circular dependencies will cause errors that are very hard to trace.

<br>

## Part 3: Creating the Modules

### Step 3: Create utils.js

Create a new file called `utils.js`. Move the pure text-processing functions into it.

Each function that other files will need must be exported. Add the `export` keyword in front of each function definition.

Test your exports are correct before moving on. A typo in an export name will not throw an error immediately it will only fail silently when another module tries to import it.

<br>

### Step 4: Create history.js

Create a new file called `history.js`. This file is responsible for the `history` array and all operations on it.

Think carefully about one design decision: should you export the `history` array directly, or is it better to export **functions** that interact with it? Consider what happens if `dom.js` can modify the array freely could that cause problems as the project grows?

If `history.js` needs to call `analyzeText`, import it from `utils.js`.

Export everything that `dom.js` will need to call.

<br>

### Step 5: Create dom.js

Create a new file called `dom.js`. This file handles all user interaction:

- All `document.querySelector` calls
- The `input` event listener on the textarea
- The `click` event listener on the save button
- The `renderHistory` function

At the top of the file, import whatever you need from `utils.js` and `history.js`. Do not import anything you do not actually use.

<br>

### Step 6: Update the script tag in tokenCounter.html

The HTML currently loads `tokenCounter.js`. Change the `<script>` tag to load `dom.js` instead, and add `type="module"`:

```html
<script type="module" src="dom.js"></script>
```

Leave `tokenCounter.js` in place for now. In Step 9 you will confirm it is no longer needed.

<br>

## Part 4: Verification

### Step 7: Open the page with Live Server

Open `tokenCounter.html` using Live Server. The URL in the browser must begin with `http://`, not `file://`.

Open the browser **Console** tab (`F12`). If you see errors, read them carefully. Here are the most common ones and what they mean:

| Error message | Likely cause |
|---|---|
| `Failed to resolve module specifier 'utils.js'` | Missing `./` prefix use `'./utils.js'` |
| `SyntaxError: Cannot use import statement` | The `<script>` tag is missing `type="module"` |
| `cleanText is not exported from './utils.js'` | The function exists but `export` was not added |
| `cleanText is not a function` | Imported under a wrong name, or not imported at all |
| `Cross-Origin Request Blocked` | You opened the file directly use Live Server |

Fix errors one at a time. The first error in the console is usually the root cause of all the others.

<br>

### Step 8: Test every feature

No errors in the console does not mean everything works. Test each feature manually:

✅ Type text into the textarea character, word, and token counts update in real time
✅ Click **Save Snapshot** a new item appears in the history list
✅ Click **Save Snapshot** a second time it is labelled "Snapshot 2"
✅ Refresh the page the counter still starts correctly from a clean state

<br>

### Step 9: Delete tokenCounter.js

Once all tests pass, delete `tokenCounter.js` (or empty its contents completely). Refresh the page. If anything breaks, your new modules are still relying on something that was left in the old file. Trace it and move it to the right module.

When the page works with `tokenCounter.js` gone, the refactor is complete.

<br>

## File Structure

After this lab your project should look like this:

```
index.html
how-it-works.html
tokenCounter.html       ← <script type="module" src="dom.js">
styles.css
utils.js                ← pure text-processing functions
history.js              ← history array and snapshot management
dom.js                  ← DOM selectors and event listeners
```

`tokenCounter.js` should be empty or deleted.

<br>

## Bonus Challenges

- Add a **Clear History** button. Write a `clearHistory` function in `history.js`, export it, import it in `dom.js`, and connect it to the button. Practice the full cycle from scratch.
- Research `export default` and rewrite one of your exports to use it. How does the import syntax change? When would you prefer `default` over named exports?
- Open the browser **Sources** (or **Debugger**) panel and expand the module tree. You should be able to see each of your `.js` files listed separately. Does the loading order match the dependency graph you drew in Step 2?
- Add a `timestamp` property to each snapshot object in `history.js` using `new Date().toLocaleTimeString()`. Display it in the rendered history list. Trace the full path the data takes: from the function in `history.js` to the element on the page.

<br>

:heart: **Happy coding!** 
