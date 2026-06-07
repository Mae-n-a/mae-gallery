/**
 * Single source of truth for all portfolio content.
 * Ported from the prototype's `window.MAE_DATA` (assets/data.js).
 *
 * Painting titles/years/dimensions are still placeholders in places — edit them
 * here and the whole site (gallery, lightbox, captions) updates automatically.
 *
 * Image paths point at files in `public/assets/**`, served from the site root.
 */

export type Work = {
  title: string;
  year: string;
  medium: string;
  /** Dimensions, e.g. "120 × 90 cm". `null` → omitted from the caption. */
  dim: string | null;
  /** width / height — drives the lightbox frame sizing. Keep accurate. */
  ratio: number;
  /** Full image path (under /assets). */
  img: string;
  /** Detail-crop / thumbnail variant. Currently unused by the layout. */
  thumb: string;
};

export type Collection = {
  id: string;
  title: string;
  /** e.g. "2015 / 16" */
  years: string;
  /** oklch hue used only for the placeholder tint fallback. */
  hue: number;
  blurb: string;
  /** Cover image shown in the cursor-follow hover preview. */
  cover: string;
  works: Work[];
};

export type CvEntry = { year: string; text: string; place: string };

export type Portfolio = {
  name: string;
  role: string;
  tagline: string;
  photo: string;
  email: string;
  location: string;
  education: CvEntry[];
  exhibitions: CvEntry[];
  statement: string;
  collections: Collection[];
};

export const portfolio: Portfolio = {
  name: 'Mae',
  role: 'Visual Artist',
  tagline: 'Acrylic paintings',
  photo: '/assets/profile.jpg',
  email: 'hello@mae.gallery',
  location: 'Milan, Italy',

  education: [
    { year: '2004', text: 'Diploma in Graphic Design', place: 'Modares Art School, Tehran (Iran)' },
    { year: '2010', text: 'B.A. in Painting', place: 'Shahed University of Art, Tehran (Iran)' },
    { year: '2016', text: 'M.A. in Painting', place: 'The Brera Academy of Fine Arts, Milan (Italy)' },
  ],

  exhibitions: [
    { year: '2014', text: 'Painting Art Prize', place: 'Centro Foscolo, Milano, Corsica (Italy)' },
    { year: '2014', text: 'Group Exhibition', place: 'Centro Foscolo, Milan, Corsica (Italy)' },
    { year: '2020', text: 'Art Prize', place: 'Comune di Sarezzo, Sarezzo (Italy)' },
    { year: '2020', text: 'Group Exhibition', place: 'St-Art Amsterdam, Ride Milano, Milan (Italy)' },
  ],

  statement:
    'Working primarily in acrylic, Mae paints bodies and landscapes caught mid-collapse — figures dissolving into water, light and exile. The work moves between Tehran and Milan, between memory and the unstable present.',

  collections: [
    {
      id: 'exile',
      title: 'Exile',
      years: '2015 / 16',
      hue: 55,
      blurb: 'Figures suspended between two shores.',
      cover: '/assets/paintings/exile/2.jpg',
      works: [
        { title: 'Exile I', year: '2016', medium: 'Acrylic on canvas', dim: null, ratio: 1.055, img: '/assets/paintings/exile/1.jpg', thumb: '/assets/paintings/exile/1_t.jpg' },
        { title: 'Exile II', year: '2016', medium: 'Acrylic on canvas', dim: null, ratio: 1.61, img: '/assets/paintings/exile/2.jpg', thumb: '/assets/paintings/exile/2_t.jpg' },
        { title: 'Exile III', year: '2015', medium: 'Acrylic on canvas', dim: null, ratio: 1.456, img: '/assets/paintings/exile/3.jpg', thumb: '/assets/paintings/exile/3_t.jpg' },
        { title: 'Exile IV', year: '2016', medium: 'Acrylic on canvas', dim: null, ratio: 0.979, img: '/assets/paintings/exile/4.jpg', thumb: '/assets/paintings/exile/4_t.jpg' },
        { title: 'Exile V', year: '2015', medium: 'Acrylic on canvas', dim: null, ratio: 1.071, img: '/assets/paintings/exile/5.jpg', thumb: '/assets/paintings/exile/5_t.jpg' },
      ],
    },
    {
      id: 'unstable',
      title: 'Unstable Falls',
      years: '2018 / 21',
      hue: 250,
      blurb: 'Water, gravity and the body undone.',
      cover: '/assets/paintings/unstable/5.jpg',
      works: [
        { title: 'Unstable Falls I', year: '2018', medium: 'Acrylic on canvas', dim: null, ratio: 0.385, img: '/assets/paintings/unstable/1.jpg', thumb: '/assets/paintings/unstable/1_t.jpg' },
        { title: 'Unstable Falls II', year: '2019', medium: 'Acrylic on canvas', dim: null, ratio: 0.625, img: '/assets/paintings/unstable/2.jpg', thumb: '/assets/paintings/unstable/2_t.jpg' },
        { title: 'Unstable Falls III', year: '2019', medium: 'Acrylic on canvas', dim: null, ratio: 1.188, img: '/assets/paintings/unstable/3.jpg', thumb: '/assets/paintings/unstable/3_t.jpg' },
        { title: 'Unstable Falls IV', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 0.385, img: '/assets/paintings/unstable/4.jpg', thumb: '/assets/paintings/unstable/4_t.jpg' },
        { title: 'Unstable Falls V', year: '2020', medium: 'Acrylic on canvas', dim: null, ratio: 1.2, img: '/assets/paintings/unstable/5.jpg', thumb: '/assets/paintings/unstable/5_t.jpg' },
        { title: 'Unstable Falls VI', year: '2020', medium: 'Acrylic on canvas', dim: null, ratio: 1.083, img: '/assets/paintings/unstable/6.jpg', thumb: '/assets/paintings/unstable/6_t.jpg' },
        { title: 'Unstable Falls VII', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 1.167, img: '/assets/paintings/unstable/7.jpg', thumb: '/assets/paintings/unstable/7_t.jpg' },
      ],
    },
    {
      id: 'blue',
      title: 'Blue',
      years: '2020 / 22',
      hue: 245,
      blurb: 'A series held entirely in blue.',
      cover: '/assets/paintings/blue/3.jpg',
      works: [
        { title: 'Blue I', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 2.339, img: '/assets/paintings/blue/1.jpg', thumb: '/assets/paintings/blue/1_t.jpg' },
        { title: 'Blue II', year: '2020', medium: 'Acrylic on canvas', dim: null, ratio: 0.909, img: '/assets/paintings/blue/2.jpg', thumb: '/assets/paintings/blue/2_t.jpg' },
        { title: 'Blue III', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/blue/3.jpg', thumb: '/assets/paintings/blue/3_t.jpg' },
        { title: 'Blue IV', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 0.923, img: '/assets/paintings/blue/4.jpg', thumb: '/assets/paintings/blue/4_t.jpg' },
        { title: 'Blue V', year: '2020', medium: 'Acrylic on canvas', dim: null, ratio: 0.992, img: '/assets/paintings/blue/5.jpg', thumb: '/assets/paintings/blue/5_t.jpg' },
        { title: 'Blue VI', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/blue/6.jpg', thumb: '/assets/paintings/blue/6_t.jpg' },
        { title: 'Blue VII', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/blue/7.jpg', thumb: '/assets/paintings/blue/7_t.jpg' },
        { title: 'Blue VIII', year: '2022', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/blue/8.jpg', thumb: '/assets/paintings/blue/8_t.jpg' },
        { title: 'Blue IX', year: '2022', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/blue/9.jpg', thumb: '/assets/paintings/blue/9_t.jpg' },
      ],
    },
    {
      id: 'other',
      title: 'Other',
      years: '2012 / 16',
      hue: 320,
      blurb: 'Earlier and uncategorised works.',
      cover: '/assets/paintings/other/8.jpg',
      works: [
        { title: 'Other I', year: '2012', medium: 'Acrylic on canvas', dim: null, ratio: 0.723, img: '/assets/paintings/other/1.jpg', thumb: '/assets/paintings/other/1_t.jpg' },
        { title: 'Other II', year: '2013', medium: 'Acrylic on canvas', dim: null, ratio: 0.723, img: '/assets/paintings/other/2.jpg', thumb: '/assets/paintings/other/2_t.jpg' },
        { title: 'Other III', year: '2013', medium: 'Acrylic on canvas', dim: null, ratio: 0.667, img: '/assets/paintings/other/3.jpg', thumb: '/assets/paintings/other/3_t.jpg' },
        { title: 'Other IV', year: '2014', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/other/4.jpg', thumb: '/assets/paintings/other/4_t.jpg' },
        { title: 'Other V', year: '2014', medium: 'Acrylic on canvas', dim: null, ratio: 0.59, img: '/assets/paintings/other/5.jpg', thumb: '/assets/paintings/other/5_t.jpg' },
        { title: 'Other VI', year: '2015', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/other/6.jpg', thumb: '/assets/paintings/other/6_t.jpg' },
        { title: 'Other VII', year: '2015', medium: 'Acrylic on canvas', dim: null, ratio: 1.563, img: '/assets/paintings/other/7.jpg', thumb: '/assets/paintings/other/7_t.jpg' },
        { title: 'Other VIII', year: '2016', medium: 'Acrylic on canvas', dim: null, ratio: 1.009, img: '/assets/paintings/other/8.jpg', thumb: '/assets/paintings/other/8_t.jpg' },
      ],
    },
  ],
};
