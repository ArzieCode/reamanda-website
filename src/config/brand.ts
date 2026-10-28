export const BRAND = {
  name: "Rheamanda",
  wordmark: "Rheamanda",
  slug: "rheamanda",
  tagline: "Elegan, Tulus, dan Abadi",
  city: "",            // fill from admin, leave empty if unknown
  foundedYear: null as number | null,   // fill from admin, hide the "Berdiri" stat if null
  founder: null as string | null,       // fill from admin, hide founder text if null
  orderPrefix: { busana: "RM", katering: "RM-CTR" },
} as const;
