import {h, render, Component} from 'preact'
import PreactImagePalette from "../lib";
// Album cover for Com Truise - Fairlight
import testImage from "./fairlight.png";

class TestComponent extends Component {
  render() {
    const { render } = this.props;
    return h(ReactImagePalette, { image: testImage }, render);
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

describe("preact-image-palette", () => {
  beforeEach(() => {
    container = document.createElement("div");
  });
  describe("provider", () => {
    it("should parse a palette from an image", done => {
      render(
        h(PreactImagePalette, {
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
      render(
        h(PreactImagePalette, {
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
