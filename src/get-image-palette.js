// @flow
import uniqBy from "lodash.uniqby";
import isEqual from "lodash.isequal";
import sortBy from "lodash.sortby";
import ColorThief from "./color-thief";
import Color from "color";

type ColorDescriptor = {
  color: Color,
  score: number,
  contrast: number
};

type ColorPairings = Array<ColorDescriptor>;

type ColorPairingMap = {
  [key: string]: ColorPairings
}

// This is the minimum required for "AA" certification
const MINIMUM_CONTRAST_RATIO = 4.5;
const IDEAL_CONTRAST_RATIO = 7.5;
// Track the total number of pixels, reset everytime
// a palette is parsed.
let totalPixelCount = 0;
// Track pixel count by RGB values, reset everytime
// a palette is parsed.
let RGBToPixelCountMap = {};

/**
 * The "range" is a metric used to determine how
 * vibrant a color is. It checks the delta between
 * the highest and lowest channel values, giving us an indiciation
 * of how dominant one range might be.
 * 
 * @example
 * For the RGB value [250, 30, 10] we can see
 * that the red channel dominates, meaning it will be
 * primarily red.
 */
function getRGBRange(color: Color) {
  var rgb = sortBy(color.rgb().array()).reverse();
  var [max, med, min] = rgb;
  return max - min;
}

/**
 * Returns a value between 0 and 1 representing how
 * many pixels in the original image are represented
 * by this color, 0 meaning none and 1 meaning all.
 * @param {*} color 
 * @returns {number}
 */
function getPixelDominance(color: Color) {
  const pixelCount: number = RGBToPixelCountMap[color];
  return pixelCount / totalPixelCount;
}

/**
 * Calculates the total score for each color
 * in an array of pairs which are matches for some
 * dominant color. Score represents viability, so higher is better.
 * @param {*} pairs 
 * @returns {number}
 */
function calculateTotalPairScore(pairs) {
  return pairs.reduce((score, color) => score + color.score, 0);
}

/**
 * Return a new array of pairs, sorted by score.
 * @param {*} pairs 
 */
function sortPairsByScore(pairs: ColorPairings) {
  pairs.sort((a, b) => {
    if (a.score === b.score) {
      return 0;
    }
    return a.score > b.score ? -1 : 1;
  });
}

/**
 * Dominance is ranked using a system that weighs
 * each dominant color by three factors:
 *  - The true dominance of the color in the original image.
 *    This is determined by tracking the total number of pixels
 *    in the image, and the total pixels found for an image,
 *    and dividing the color pixels by the total.
 * 
 *  - The number of valid color pairs. If a color has no matching
 *    pairs it is given a score of zero, since we can't build
 *    a color palette with a single color.
 * 
 *  - The total score of each matching color. Each color is scored
 *    based on the contrast with the dominant color, the dominance
 *    in the original image, and its "range", which is the difference
 *    between the highest channel value and lowest, which sort of measures
 *    vibrance.
 * @param {*} WCAGCompliantColorPairs 
 */
function getMostDominantPrimaryColor(WCAGCompliantColorPairs: ColorPairingMap) {
  var highestDominanceScore = 0;
  var mostDominantColor = "";
  for (var dominantColor in WCAGCompliantColorPairs) {
    var pairs = WCAGCompliantColorPairs[dominantColor];
    var dominance = getPixelDominance(dominantColor);
    var totalPairScore = calculateTotalPairScore(pairs);
    var score = pairs.length ? (pairs.length + totalPairScore) * dominance : 0;
    if (score > highestDominanceScore) {
      highestDominanceScore = score;
      mostDominantColor = dominantColor;
    }
  }
  sortPairsByScore(WCAGCompliantColorPairs[mostDominantColor]);
  return mostDominantColor;
}

/**
 * Gets the palette for an image from color-thief and maps
 * the colors to Color instances. It also re-initializes
 * and updates the RGBToPixelCountMap so we get a fresh
 * dataset for pixel dominance
 * @param {string} image 
 * @param {ColorThief} colorThief 
 */
function getColorPalette(image, colorThief: ColorThief) : Array<Color> {
  totalPixelCount = 0;
  RGBToPixelCountMap = {};
  return colorThief.getPalette(image).map(color => {
    var colorWrapper = new Color(color.rgb);
    RGBToPixelCountMap[colorWrapper] = color.count;
    totalPixelCount += color.count;
    return colorWrapper;
  });
}

/**
 * The main export that takes an image URI and optional instance
 * of color-thief and generates the palletes. Responsible for
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
  var palletes = getColorPalette(image, colorThief);
  var highestMatchCount = 0;
  var WCAGCompliantColorPairs : ColorPairingMap = {};
  palletes.forEach((dominantColor, index) => {
    var pairs = (WCAGCompliantColorPairs[dominantColor] = []);
    palletes.forEach(color => {
      var contrast = dominantColor.contrast(color);
      if (contrast > MINIMUM_CONTRAST_RATIO) {
        /**
         * The score is determined based three things:
         * 
         *  contrast:
         *     how well contrasted the color is with the dominant color.
         *  dominance:
         *    the level of dominance of the dominant color
         *    which is based on the index of the color in
         *    the palette array.
         *   range/vibrance:
         *    we want some vibrant colors
         */
        var range = getRGBRange(color);
        /**0
         * If the contrast isn't high enough, lighten/darken
         * the color so that we get a more accessible
         * version of the color.
         */
        if (contrast < IDEAL_CONTRAST_RATIO) {
          var delta = (IDEAL_CONTRAST_RATIO - contrast) / 15;
          color = dominantColor.dark()
            ? color.lighten(delta)
            : color.darken(delta);
        }
        var score = contrast - index + range;
        pairs.push({ color, score, contrast });
      }
    });
  });
  var backgroundColor = getMostDominantPrimaryColor(WCAGCompliantColorPairs);
  var [color, alternativeColor] = WCAGCompliantColorPairs[backgroundColor];
  if (!alternativeColor) {
    alternativeColor = color;
  }
  return {
    backgroundColor,
    color: color.color.hex(),
    alternativeColor: alternativeColor.color.hex()
  };
}
