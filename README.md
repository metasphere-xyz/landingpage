# landingpage

Source for the landing page

Test page: https://metasphere-xyz.github.io/landingpage/

## Compiling a script

To compile a script for the landingpage, please take the following steps,

1. Install dependencies (first time only).

    ```
    npm ci
    ```

2. Run a `build` command.

    ```
    npm run build
    ```

3. You will find a script `research-explorer.js` in a `js` directory.

### Compiling a script for production

By default, a script is compiled for development.
To compile a script for production, please run the following command at the step 2 instead.

```
npm run build -- --mode=production
```