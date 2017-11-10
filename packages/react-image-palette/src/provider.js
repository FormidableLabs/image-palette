import React from "react";
import getImagePalette from "image-palette-core";

export default class ImagePaletteProvider extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { colors: null };
    this.onImageload = this.onImageload.bind(this);
    this.onImageError = this.onImageError.bind(this);
  }

  componentDidMount() {
    const image = (this.image = new Image());
    image.crossOrigin = this.props.crossOrigin;
    image.src = this.props.image;
    image.onload = this.onImageload;
    image.onerror = this.onImageError;
  }

  componentWillUnmount() {
    this.image.onload = null;
    this.image.onerror = null;
  }

  onImageload() {
    var image = this.image;
    var colors = getImagePalette(this.image);
    this.setState({ colors });
  }

  onImageError() {
    if (this.props.defaults) {
      this.setState({ colors: this.props.defaults });
    }
  }

  render() {
    const { colors } = this.state;
    const { children, render } = this.props;
    const callback = render || children;
    if (!callback) {
      throw new Error(
        "ImagePaletteProvider expects a render callback either as a child or via the `render` prop"
      );
    }
    return colors ? callback(colors) : null;
  }
}
