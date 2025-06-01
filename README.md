# prettier-plugin-void-html

This is a [Prettier plugin](https://prettier.io/docs/en/plugins) to format [void HTML elements](https://developer.mozilla.org/en-US/docs/Glossary/Void_element) using the void tag syntax instead of self-closing syntax. Additionally, if self-closing syntax is used on non-void elements, then they will be "unwrapped" so that both the opening and closing tags are present.

## Usage

Install this package from NPM using your favorite package manager:

- [`npm`](https://docs.npmjs.com/cli/v10/configuring-npm/install)
  ```sh
  npm install -D @pebrianz/prettier-plugin-void-html
  ```
- [`yarn`](https://yarnpkg.com/getting-started/install)
  ```sh
  yarn add -D @pebrianz/prettier-plugin-void-html
  ```
- [`pnpm`](https://pnpm.io/installation)
  ```sh
  pnpm add -D @pebrianz/prettier-plugin-void-html
  ```

Add the plugin to your [Prettier config file](https://prettier.io/docs/en/configuration).

```json
{
  "plugins": ["@pebrianz/prettier-plugin-void-html"]
}
```

Then your HTML should format like so:

<!-- prettier-ignore-start -->
```html
<!-- source -->
<meta charset="UTF-8">
<label for="my-input">Type something</label>
<input id="my-input" type="text" name="my-input">
<div />

<!-- Prettier default formatting -->
<meta charset="UTF-8" />
<label for="my-input">Type something</label>
<input id="my-input" type="text" name="my-input" />
<div />

<!-- Prettier + this plugin -->
<meta charset="UTF-8">
<label for="my-input">Type something</label>
<input id="my-input" type="text" name="my-input">
<div></div>
```
<!-- prettier-ignore-end -->

## Compatibility

### Languages

This project currently supports HTML, only. Support for other languages such as Svelte or Vue requires using an entirely different parser and is currently outside the scope of this plugin.

If you want the features provided by this package in another language, I recommend submitting feedback to the other projects that handle formatting those languages.

### Void elements

https://developer.mozilla.org/en-US/docs/Glossary/Void_element

- `area`
- `base`
- `br`
- `col`
- `embed`
- `hr`
- `img`
- `input`
- `link`
- `meta`
- `param`
- `source`
- `track`
- `wbr`

# prettier-plugin-void-html
