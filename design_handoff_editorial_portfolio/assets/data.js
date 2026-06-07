/* Shared portfolio data for Mae — visual artist.
   Painting entries are PLACEHOLDERS (title/medium/dimensions) to demonstrate layout.
   Replace titles, years, dimensions and drop real images once a direction is chosen. */
window.MAE_DATA = {
  name: "Mae",
  role: "Visual Artist",
  tagline: "Acrylic paintings",
  photo: "assets/profile.jpg",
  email: "hello@mae.gallery",
  location: "Milan, Italy",

  education: [
    { year: "2004", text: "Diploma in Graphic Design", place: "Modares Art School, Tehran (Iran)" },
    { year: "2010", text: "B.A. in Painting", place: "Shahed University of Art, Tehran (Iran)" },
    { year: "2016", text: "M.A. in Painting", place: "The Brera Academy of Fine Arts, Milan (Italy)" }
  ],

  exhibitions: [
    { year: "2014", text: "Painting Art Prize", place: "Centro Foscolo, Milano, Corsica (Italy)" },
    { year: "2014", text: "Group Exhibition", place: "Centro Foscolo, Milan, Corsica (Italy)" },
    { year: "2020", text: "Art Prize", place: "Comune di Sarezzo, Sarezzo (Italy)" },
    { year: "2020", text: "Group Exhibition", place: "St-Art Amsterdam, Ride Milano, Milan (Italy)" }
  ],

  statement: "Working primarily in acrylic, Mae paints bodies and landscapes caught mid-collapse — figures dissolving into water, light and exile. The work moves between Tehran and Milan, between memory and the unstable present.",

  /* hue: low-chroma oklch hue used to subtly tint placeholder canvases per series.
     Each work: ratio = width / height, used to size placeholders. */
  collections: [
    {
      id: "exile", title: "Exile", years: "2015 / 16", hue: 55,
      blurb: "Figures suspended between two shores.",
      cover: "assets/paintings/exile/2.jpg",
      works: [
        { title: "Exile I",   year: "2016", medium: "Acrylic on canvas", dim: null, ratio: 1.055, img: "assets/paintings/exile/1.jpg", thumb: "assets/paintings/exile/1_t.jpg" },
        { title: "Exile II",  year: "2016", medium: "Acrylic on canvas", dim: null, ratio: 1.610, img: "assets/paintings/exile/2.jpg", thumb: "assets/paintings/exile/2_t.jpg" },
        { title: "Exile III", year: "2015", medium: "Acrylic on canvas", dim: null, ratio: 1.456, img: "assets/paintings/exile/3.jpg", thumb: "assets/paintings/exile/3_t.jpg" },
        { title: "Exile IV",  year: "2016", medium: "Acrylic on canvas", dim: null, ratio: 0.979, img: "assets/paintings/exile/4.jpg", thumb: "assets/paintings/exile/4_t.jpg" },
        { title: "Exile V",   year: "2015", medium: "Acrylic on canvas", dim: null, ratio: 1.071, img: "assets/paintings/exile/5.jpg", thumb: "assets/paintings/exile/5_t.jpg" }
      ]
    },
    {
      id: "unstable", title: "Unstable Falls", years: "2018 / 21", hue: 250,
      blurb: "Water, gravity and the body undone.",
      cover: "assets/paintings/unstable/5.jpg",
      works: [
        { title: "Unstable Falls I",   year: "2018", medium: "Acrylic on canvas", dim: null, ratio: 0.385, img: "assets/paintings/unstable/1.jpg", thumb: "assets/paintings/unstable/1_t.jpg" },
        { title: "Unstable Falls II",  year: "2019", medium: "Acrylic on canvas", dim: null, ratio: 0.625, img: "assets/paintings/unstable/2.jpg", thumb: "assets/paintings/unstable/2_t.jpg" },
        { title: "Unstable Falls III", year: "2019", medium: "Acrylic on canvas", dim: null, ratio: 1.188, img: "assets/paintings/unstable/3.jpg", thumb: "assets/paintings/unstable/3_t.jpg" },
        { title: "Unstable Falls IV",  year: "2021", medium: "Acrylic on canvas", dim: null, ratio: 0.385, img: "assets/paintings/unstable/4.jpg", thumb: "assets/paintings/unstable/4_t.jpg" },
        { title: "Unstable Falls V",   year: "2020", medium: "Acrylic on canvas", dim: null, ratio: 1.200, img: "assets/paintings/unstable/5.jpg", thumb: "assets/paintings/unstable/5_t.jpg" },
        { title: "Unstable Falls VI",  year: "2020", medium: "Acrylic on canvas", dim: null, ratio: 1.083, img: "assets/paintings/unstable/6.jpg", thumb: "assets/paintings/unstable/6_t.jpg" },
        { title: "Unstable Falls VII", year: "2021", medium: "Acrylic on canvas", dim: null, ratio: 1.167, img: "assets/paintings/unstable/7.jpg", thumb: "assets/paintings/unstable/7_t.jpg" }
      ]
    },
    {
      id: "blue", title: "Blue", years: "2020 / 22", hue: 245,
      blurb: "A series held entirely in blue.",
      cover: "assets/paintings/blue/3.jpg",
      works: [
        { title: "Blue I",    year: "2021", medium: "Acrylic on canvas", dim: null, ratio: 2.339, img: "assets/paintings/blue/1.jpg", thumb: "assets/paintings/blue/1_t.jpg" },
        { title: "Blue II",   year: "2020", medium: "Acrylic on canvas", dim: null, ratio: 0.909, img: "assets/paintings/blue/2.jpg", thumb: "assets/paintings/blue/2_t.jpg" },
        { title: "Blue III",  year: "2021", medium: "Acrylic on canvas", dim: null, ratio: 1.0,   img: "assets/paintings/blue/3.jpg", thumb: "assets/paintings/blue/3_t.jpg" },
        { title: "Blue IV",   year: "2021", medium: "Acrylic on canvas", dim: null, ratio: 0.923, img: "assets/paintings/blue/4.jpg", thumb: "assets/paintings/blue/4_t.jpg" },
        { title: "Blue V",    year: "2020", medium: "Acrylic on canvas", dim: null, ratio: 0.992, img: "assets/paintings/blue/5.jpg", thumb: "assets/paintings/blue/5_t.jpg" },
        { title: "Blue VI",   year: "2021", medium: "Acrylic on canvas", dim: null, ratio: 1.0,   img: "assets/paintings/blue/6.jpg", thumb: "assets/paintings/blue/6_t.jpg" },
        { title: "Blue VII",  year: "2021", medium: "Acrylic on canvas", dim: null, ratio: 1.0,   img: "assets/paintings/blue/7.jpg", thumb: "assets/paintings/blue/7_t.jpg" },
        { title: "Blue VIII", year: "2022", medium: "Acrylic on canvas", dim: null, ratio: 1.0,   img: "assets/paintings/blue/8.jpg", thumb: "assets/paintings/blue/8_t.jpg" },
        { title: "Blue IX",   year: "2022", medium: "Acrylic on canvas", dim: null, ratio: 1.0,   img: "assets/paintings/blue/9.jpg", thumb: "assets/paintings/blue/9_t.jpg" }
      ]
    },
    {
      id: "other", title: "Other", years: "2012 / 16", hue: 320,
      blurb: "Earlier and uncategorised works.",
      cover: "assets/paintings/other/8.jpg",
      works: [
        { title: "Other I",    year: "2012", medium: "Acrylic on canvas", dim: null, ratio: 0.723, img: "assets/paintings/other/1.jpg", thumb: "assets/paintings/other/1_t.jpg" },
        { title: "Other II",   year: "2013", medium: "Acrylic on canvas", dim: null, ratio: 0.723, img: "assets/paintings/other/2.jpg", thumb: "assets/paintings/other/2_t.jpg" },
        { title: "Other III",  year: "2013", medium: "Acrylic on canvas", dim: null, ratio: 0.667, img: "assets/paintings/other/3.jpg", thumb: "assets/paintings/other/3_t.jpg" },
        { title: "Other IV",   year: "2014", medium: "Acrylic on canvas", dim: null, ratio: 1.000, img: "assets/paintings/other/4.jpg", thumb: "assets/paintings/other/4_t.jpg" },
        { title: "Other V",    year: "2014", medium: "Acrylic on canvas", dim: null, ratio: 0.590, img: "assets/paintings/other/5.jpg", thumb: "assets/paintings/other/5_t.jpg" },
        { title: "Other VI",   year: "2015", medium: "Acrylic on canvas", dim: null, ratio: 1.000, img: "assets/paintings/other/6.jpg", thumb: "assets/paintings/other/6_t.jpg" },
        { title: "Other VII",  year: "2015", medium: "Acrylic on canvas", dim: null, ratio: 1.563, img: "assets/paintings/other/7.jpg", thumb: "assets/paintings/other/7_t.jpg" },
        { title: "Other VIII", year: "2016", medium: "Acrylic on canvas", dim: null, ratio: 1.009, img: "assets/paintings/other/8.jpg", thumb: "assets/paintings/other/8_t.jpg" }
      ]
    }
  ]
};