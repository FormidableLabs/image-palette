// @flow
import colorableDominant from "colorable-dominant";
import Color from "color";

import ColorThief from "./color-thief";

/**
 * The main export that takes an image URI and optional instance
 * of color-thief and generates the palettes. Responsible for
 * building the WCAGCompliantColorPairs map and generating
 * accessible color pairings.
 *
 * Returns an object with a backgroundColor, color, and alternativeColor.
 * If there's only one potential color pairing, alternativeColor will
 * just be color.
 * @param {*} image
 * @param {*} colorThief
 */
export default function getImagePalette(image: string, colorThief: ColorThief) {
  colorThief = colorThief || new ColorThief();
  const palette = colorThief
    .getPalette(image)
    .map(color => new Color(color.rgb).hex());
  return colorableDominant(palette);
}
