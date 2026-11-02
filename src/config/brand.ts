export const BRAND = {
  name: "Rheamanda",
  wordmark: "Rheamanda Group",
  slug: "rheamanda",
  tagline: "Building Better Living",
  city: "",            // fill from admin, leave empty if unknown
  foundedYear: 2019 as number | null,
  founder: null as string | null,       // fill from admin, hide founder text if null
  orderPrefix: { busana: "RM", katering: "RM-CTR" },
} as const;
