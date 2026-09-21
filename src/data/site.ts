export const site = {
  name: "Musebox AI Video Guide",
  domain: "musebox.fun",
  url: "https://musebox.fun",
  description: "An independent Musebox AI video guide covering image-to-video workflows, reels, collections, privacy, consent, credits, safety, and leading alternatives.",
  author: "Musebox Video Guide editorial team",
  officialUrl: "https://musebox.ai/",
};

export const formatDate = (date: Date) => new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(date);
export const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);
