[![Build Status](https://travis-ci.com/FormidableLabs/react-image-palette.svg?token=ycKCGETrX5nV3P6ePUdx&branch=master)](https://travis-ci.com/FormidableLabs/react-image-palette)


<h1 align="center">react-image-palette</h1>


<h4 align="center">
  Dynamically generate accessible color palettes from images
</h4>

![react-image-palette demo](./screenshot.png)



Implement adaptive UIs dynamically from any image in right in your React application. Every palette is parsed from the most dominant and vibrant colors in the source image, and guaranteed to meet the [WCAG contrast standard](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html) for accessible color pairings.


### Install

```
npm install --save react-image-palette
```

## Usage

The main export of the package is the `ImagePalette` component, which uses a [render callback](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) to provide the color palette after the image is parsed.

```jsx
import ImagePalette from 'react-image-palette'

const SomeComponent = ({ image }) => (
  <ImagePalette image={image}>
    {({ backgroundColor, color, alternativeColor }) => (
      <div style={{ backgroundColor, color }}>
        This div has been themed based on
        <span style={{ color: alternativeColor }}>{image}</span>
      </div>
    )}
  </ImagePalette>
)
```


## API


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

### Props

Property  	| 	Type		|	  Description
:-----------------------|:--------------|:--------------------------------
`image` |   `String!` |  The URL for the image to parse.
`crossOrigin` | `Boolean` | Sets the `crossOrigin` property on the `Image` instance that loads the source image <sup>1</sup>
`render` | `Palette => ReactElement` | If you prefer to use a `render` prop over a function child, go for it! `react-image-palette` supports both.
`defaults` | `Palette` | A default palette to render if a palette cannot be parsed. This would typically occur when the source image fails to load

> <sup>1</sup> ⚠️ Keep in mind that the image will be loaded into a canvas and parsed as data, so you should only use images from trusted origins. 

#### Imperative API

If you want to manually call the image palette function yourself it's exported as `getImagePalette`

```js
import {getImagePalette} from 'react-image-palette'

const palette = getImagePalette("foo.jpg");
```

This can be useful if you want to use the palette generator without React, or define your own provider component. The image must be loaded _before_ calling `getImagePalette`.