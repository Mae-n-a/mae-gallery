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
  photo: '/assets/profile.webp',
  email: 'hello@mae.gallery',
  location: 'Turin, Italy',

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
    { year: '2021', text: 'Group Exhibition', place: 'C-Frigerio Group, Milano, Corsico (Italy)' },
    { year: '2022', text: 'Group Exhibition', place: 'Ossimoro Art Gallery, Turin (Italy)' },
    { year: '2022', text: 'Virtual Exhibition', place: 'Ossimoro Art Gallery, Turin (Italy)' },
  ],

  statement:
    'My work begins with memory. I paint the human figure in fresh, transparent acrylics, letting color carry the thought. The indigo and Persian blue of my homeland, Iran, meet the turquoise and red of emotion held in balance. The figures move lightly through the air, suspended between presence and disappearance.',

  collections: [
    {
      id: 'exile',
      title: 'Exile',
      years: '2015 / 16',
      hue: 55,
      blurb: 'Figures suspended between two shores.',
      cover: '/assets/paintings/exile/mae-exile-acrylic-painting-02-cover.webp',
      works: [
        { title: 'Exile I', year: '2016', medium: 'Acrylic on canvas', dim: null, ratio: 1.055, img: '/assets/paintings/exile/mae-exile-acrylic-painting-01.webp' },
        { title: 'Exile II', year: '2016', medium: 'Acrylic on canvas', dim: null, ratio: 1.61, img: '/assets/paintings/exile/mae-exile-acrylic-painting-02.webp' },
        { title: 'Exile III', year: '2015', medium: 'Acrylic on canvas', dim: null, ratio: 1.456, img: '/assets/paintings/exile/mae-exile-acrylic-painting-03.webp' },
        { title: 'Exile IV', year: '2016', medium: 'Acrylic on canvas', dim: null, ratio: 0.979, img: '/assets/paintings/exile/mae-exile-acrylic-painting-04.webp' },
        { title: 'Exile V', year: '2015', medium: 'Acrylic on canvas', dim: null, ratio: 1.071, img: '/assets/paintings/exile/mae-exile-acrylic-painting-05.webp' },
      ],
    },
    {
      id: 'unstable',
      title: 'Unstable Falls',
      years: '2018 / 21',
      hue: 250,
      blurb: 'Water, gravity and the body undone.',
      cover: '/assets/paintings/unstable/mae-unstable-falls-acrylic-painting-06-cover.webp',
      works: [
        { title: 'Unstable Falls I', year: '2018', medium: 'Acrylic on canvas', dim: null, ratio: 0.407, img: '/assets/paintings/unstable/mae-unstable-falls-acrylic-painting-01.webp' },
        { title: 'Unstable Falls II', year: '2019', medium: 'Acrylic on canvas', dim: null, ratio: 1.188, img: '/assets/paintings/unstable/mae-unstable-falls-acrylic-painting-02.webp' },
        { title: 'Unstable Falls III', year: '2019', medium: 'Acrylic on canvas', dim: null, ratio: 0.385, img: '/assets/paintings/unstable/mae-unstable-falls-acrylic-painting-03.webp' },
        { title: 'Unstable Falls IV', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 1.083, img: '/assets/paintings/unstable/mae-unstable-falls-acrylic-painting-04.webp' },
        { title: 'Unstable Falls V', year: '2020', medium: 'Acrylic on canvas', dim: null, ratio: 0.625, img: '/assets/paintings/unstable/mae-unstable-falls-acrylic-painting-05.webp' },
        { title: 'Unstable Falls VI', year: '2020', medium: 'Acrylic on canvas', dim: null, ratio: 1.2, img: '/assets/paintings/unstable/mae-unstable-falls-acrylic-painting-06.webp' },
        { title: 'Unstable Falls VII', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 1.167, img: '/assets/paintings/unstable/mae-unstable-falls-acrylic-painting-07.webp' },
      ],
    },
    {
      id: 'blue',
      title: 'Blue',
      years: '2020 / 22',
      hue: 245,
      blurb: 'A series held entirely in blue.',
      cover: '/assets/paintings/blue/mae-persian-blue-acrylic-painting-01-cover.webp',
      works: [
        { title: 'Blue I', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/blue/mae-persian-blue-acrylic-painting-01.webp' },
        { title: 'Blue II', year: '2020', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/blue/mae-persian-blue-acrylic-painting-02.webp' },
        { title: 'Blue III', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/blue/mae-persian-blue-acrylic-painting-03.webp' },
        { title: 'Blue IV', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 0.937, img: '/assets/paintings/blue/mae-persian-blue-acrylic-painting-04.webp' },
        { title: 'Blue V', year: '2020', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/blue/mae-persian-blue-acrylic-painting-05.webp' },
        { title: 'Blue VI', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 0.649, img: '/assets/paintings/blue/mae-persian-blue-acrylic-painting-06.webp' },
        { title: 'Blue VII', year: '2021', medium: 'Acrylic on canvas', dim: null, ratio: 2.339, img: '/assets/paintings/blue/mae-persian-blue-acrylic-painting-07.webp' },
        { title: 'Blue VIII', year: '2022', medium: 'Acrylic on canvas', dim: null, ratio: 0.904, img: '/assets/paintings/blue/mae-persian-blue-acrylic-painting-08.webp' },
      ],
    },
    {
      id: 'other',
      title: 'Other',
      years: '2012 / 16',
      hue: 320,
      blurb: 'Earlier and uncategorised works.',
      cover: '/assets/paintings/other/mae-figurative-acrylic-painting-02-cover.webp',
      works: [
        { title: 'Other I', year: '2012', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/other/mae-figurative-acrylic-painting-01.webp' },
        { title: 'Other II', year: '2013', medium: 'Acrylic on canvas', dim: null, ratio: 1.0, img: '/assets/paintings/other/mae-figurative-acrylic-painting-02.webp' },
        { title: 'Other III', year: '2013', medium: 'Acrylic on canvas', dim: null, ratio: 1.563, img: '/assets/paintings/other/mae-figurative-acrylic-painting-03.webp' },
        { title: 'Other IV', year: '2014', medium: 'Acrylic on canvas', dim: null, ratio: 0.723, img: '/assets/paintings/other/mae-figurative-acrylic-painting-04.webp' },
        { title: 'Other V', year: '2014', medium: 'Acrylic on canvas', dim: null, ratio: 0.723, img: '/assets/paintings/other/mae-figurative-acrylic-painting-05.webp' },
        { title: 'Other VI', year: '2015', medium: 'Acrylic on canvas', dim: null, ratio: 1.009, img: '/assets/paintings/other/mae-figurative-acrylic-painting-06.webp' },
        { title: 'Other VII', year: '2015', medium: 'Acrylic on canvas', dim: null, ratio: 0.59, img: '/assets/paintings/other/mae-figurative-acrylic-painting-07.webp' },
      ],
    },
  ],
};
