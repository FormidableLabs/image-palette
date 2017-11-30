# react-image-palette


A React adpater for [`image-palette-core`](https://github.com/FormidableLabs/image-palette/tree/master/packages/image-palette-core)


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

### Palette

See the [`image-palette-core` documentation](https://github.com/FormidableLabs/tree/master/packages/image-palette-core#the-palette)

### Props

Property  	| 	Type		|	  Description
:-----------------------|:--------------|:--------------------------------
`image` |   `String!` |  The URL for the image to parse.
`crossOrigin` | `Boolean` | Sets the `crossOrigin` property on the `Image` instance that loads the source image <sup>1</sup>
`render` | `Palette => ReactElement` | If you prefer to use a `render` prop over a function child, go for it! `react-image-palette` supports both.
`defaults` | `Palette` | A default palette to render if a palette cannot be parsed. This would typically occur when the source image fails to load

> <sup>1</sup> ⚠️ Keep in mind that the image will be loaded into a canvas and parsed as data, so you should only use images from trusted origins. 
