import getImagePalette from "../lib";
// Album cover for Com Truise - Fairlight
import testImage from "./fairlight.png";

describe("image-palette-core", () => {
  describe("provider", () => {
    it("should parse a palette from an image", done => {
      const img = new Image();
      img.src = testImage;
      img.onload = () => {
        const palette = getImagePalette(img);
        expect(palette.backgroundColor).to.equal("rgb(60, 16, 32)");
        expect(palette.color).to.equal("#EF4E2E");
        expect(palette.alternativeColor).to.equal("#D17872");
        done();
      };
    });
  });
});
