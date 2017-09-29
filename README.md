[![Build Status](https://travis-ci.com/FormidableLabs/react-image-palette.svg?token=ycKCGETrX5nV3P6ePUdx&branch=master)](https://travis-ci.com/FormidableLabs/react-image-palette)


<h1 align="center">react-image-palette</h1>

<h4 align="center">
  Dynamically generate accessible color palettes from images
</h4>


Implement adaptive UIs based from any image in right in your React application. Every palette is generated based on the most dominant and vibrant colors and guaranteed to meet the [WCAG contrast standard](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html) for accessible color pairings.


### Install

```
npm install --save react-image-palette
```

### Usage

The main export of the package is the `ImagePalette` component, which uses a render callback to provide the color palette after the image is parsed.

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

The render callback is called with an object that has a `backgroundColor`, `color`, and `alternativeColor` property. The `backgroundColor` is the most dominant color of the image, while `color` and `alternativeColor` are colors that have been determined to pair the best. Keep in mind that you can overlay `color` over `backgroundColor`, but you can't overlay `color` on `alternativeColor` or vice-versa.


#### Imperative API

If you want to manually call the image palette function yourself it's exported as `getImagePalette`

```js
import {getImagePalette} from 'react-image-palette'

const palette = getImagePalette("foo.jpg");
```

This can be useful if you want to use the palette generator without React, or define your own provider component.