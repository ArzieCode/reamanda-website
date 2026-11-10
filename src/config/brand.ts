export const BRAND = {
  name: "Rheamanda",
  wordmark: "Rheamanda Group",
  slug: "rheamanda",
  tagline: "Growing with Purpose, Serving with Heart",
  city: "",            // fill from admin, leave empty if unknown
  foundedYear: 2019 as number | null,
  founder: null as string | null,       // fill from admin, hide founder text if null
  orderPrefix: { busana: "RM", katering: "RM-CTR" },
} as const;
