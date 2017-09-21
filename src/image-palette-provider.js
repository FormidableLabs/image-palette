import React from "react";
import getImagePalette from "./image-palette-provider";

export default class ImagePaletteProvider extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { colors: null };
    this.onImageload = this.onImageload.bind(this);
  }

  componentDidMount() {
    const image = (this.image = new Image());
    image.src = this.props.image;
    image.onload = this.onImageload;
  }

  onImageload() {
    var image = this.image;
    var colors = getImagePalette(this.image);
    this.setState({ colors });
  }

  onImageError() {
    if (this.props.defaults) {
      this.setState({ colors: this.props.defaults })
    }
  }

  render() {
    const { colors } = this.state;
    const { children } = this.props;
    return colors ? children(colors) : null;
  }
}
