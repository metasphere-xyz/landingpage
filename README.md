# landingpage

Source for the landing page

Test page: https://metasphere-xyz.github.io/landingpage/

## CSS files

There are CSS files in the `css` directory.
- [`css/common.css`](css/common.css) defines common styles.
- [`css/main.css`](css/main.css) defines styles used in [`index.html`](index.html).
- [`css/research-explorer.css`](css/research-explorer.css): defines styles used in [`research-explorer.html`](research-explorer.html).

## JavaScript files

There are JavaScript files in the `js` and `src` directories.
Files in the `js` directory are built from files in the `src` directory.
Please refer to the section [Compiling scripts](#compiling-scripts) for how to compile scripts.

Here are brief descriptions about files in the `src` directory.
- [`src/js/main.js`](src/js/main.js) attaches a Vue instance to [`index.html`](index.html).
- [`src/js/research-explorer.js`](src/js/research-explorer.js) attaches a Vue instance to [`research-explorer.html`](research-explorer.html).
- [`src/js/components/project-list-mixin.js`](src/js/components/project-list-mixin.js) implements behavior of a project list in [`index.html`](index.html).
- [`src/js/components/section-navigator-mixin.js`](src/js/components/section-navigator-mixin.js) implements behavior of a section navigator in [`research-explorer.html`](research-explorer.html).

## Compiling scripts

[Vue.js](https://vuejs.org) is supplementally used to add some dynamic behavior to the landing page.
No CSS is defined in JavaScript code since no single component file is used.

### Prerequisites

You need the following software installed,
- [Node.js](https://nodejs.org/en/) (tested with v12.14.0)

### Steps

To compile scripts for the landingpage, please take the following steps,

1. Install dependencies (first time only).

    ```
    npm ci
    ```

2. Run a `build` command.

    ```
    npm run build
    ```

3. You will find scripts in a `js` directory.
    - `js/main.js`: script for the main page.
    - `js/research-explorer.js`: script for the details page of the research explorer.

### Compiling scripts for production

By default, scripts are compiled for development.
To compile scripts for production, please run the following command at the step 2 instead.

```
npm run build -- --mode=production
```