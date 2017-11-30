# image-palette-core

The core logic for parsing a palette from image data. You can use this if you want an imperative
API for generating a palette. If you want to use it with React you can use [`react-image-palette`](https://github.com/FormidableLabs/image-palette/tree/master/packages/react-image-palette)

### Install

```
npm install --save image-palette-core
```

## Usage

The main export of the package is a `getImagePalette` function which takes an image and returns an accessible color palette representing the most dominant colors in the image.

```js
import getImagePalette from 'image-palette-core'

const img = new Image();
img.src = 'foo.jpg';
img.onload = function() {
  // The image *must* be loaded before calling `getImagePalette`
  const palette = getImagePalette(img);
}
```

> ⚠️ Keep in mind that the image will be loaded into a canvas and parsed as data, so you should only use images from trusted origins. 

### The Palette

The parsed palette will have the following shape:

```
type Palette = {
  backgroundColor: String,
  color: String,
  alternativeColor: String
}
```

* `backgroundColor` will be the most dominant color in the image.
* `color` will be the color that looks the best overlayed over `backgroundColor`. 
* `alternativeColor` will be the second best color. If there are only two colors parsed, it will default to `color`.

Both `alternativeColor` and `color` are guaranteed to meet the minimum contrast ratio requirements when overlayed with `backgroundColor`, but overlaying `color` on `alternativeColor` (or vice-versa) is a bad idea as they will often have very similar contrast levels.
