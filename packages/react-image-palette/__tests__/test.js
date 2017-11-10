import React from "react";
import ReactDOM from "react-dom";
import ReactImagePalette from "../lib";
// Album cover for Com Truise - Fairlight
import testImage from "./fairlight.png";

class TestComponent extends React.Component {
  render() {
    const { render } = this.props;
    return React.createElement(ReactImagePalette, { image: testImage }, render);
  }
}

let container;

const renderWithExpect = (done, palette) => {
  expect(palette.backgroundColor).to.equal("rgb(60, 16, 32)");
  expect(palette.color).to.equal("#EF4E2E");
  expect(palette.alternativeColor).to.equal("#D17872");
  done();
  // Return null so React doesn't throw an error
  // about an empty return
  return null;
};

describe("react-image-palette", () => {
  beforeEach(() => {
    container = document.createElement("div");
  });
  describe("provider", () => {
    it("should parse a palette from an image", done => {
      ReactDOM.render(
        React.createElement(ReactImagePalette, {
          image: testImage,
          render: renderWithExpect.bind(this, done)
        }),
        container
      );
    });
    it("should render defaults if the image fails to load", done => {
      const defaults = {
        backgroundColor: "red",
        color: "white",
        alternativeColor: "blue"
      };
      ReactDOM.render(
        React.createElement(ReactImagePalette, {
          image: "unknown-image.gif",
          defaults,
          render: palette => {
            expect(palette).to.equal(defaults);
            done();
            return null;
          }
        }),
        container
      );
    });
  });
});
