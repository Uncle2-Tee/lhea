import type { RegisteredNominee } from "@/lib/demo-state";

export type Nominee = {
  id: string;
  name: string;
  detail: string;
  accent: string;
};

export type AwardCategory = {
  id: string;
  name: string;
  description: string;
  nominees: Nominee[];
};

const artistNominees: Nominee[] = [
  { id: "king-promise", name: "King Promise", detail: "Afrobeats · Highlife", accent: "#f3c96b" },
  { id: "stonebwoy", name: "Stonebwoy", detail: "Dancehall · Reggae", accent: "#b5a4f5" },
  { id: "sarkodie", name: "Sarkodie", detail: "Hip-hop · Hiplife", accent: "#88c6d9" },
  { id: "kofi-kinaata", name: "Kofi Kinaata", detail: "Highlife · Songwriting", accent: "#ed9d82" },
  { id: "black-sherif", name: "Black Sherif", detail: "Afrobeats · Hip-hop", accent: "#8da989" },
];

export const categories: AwardCategory[] = [
  {
    id: "best-artist",
    name: "Best Artist",
    description: "Honouring the artists who made this year unforgettable.",
    nominees: artistNominees,
  },
  {
    id: "best-actor",
    name: "Best Actor",
    description: "Celebrating outstanding performances on screen and stage.",
    nominees: [
      { id: "actor-one", name: "Kojo Mensah", detail: "Film · Drama", accent: "#b5a4f5" },
      { id: "actor-two", name: "Kwame Boateng", detail: "Television · Drama", accent: "#ed9d82" },
      { id: "actor-three", name: "Nana Yaw", detail: "Film · Comedy", accent: "#88c6d9" },
    ],
  },
  {
    id: "best-actress",
    name: "Best Actress",
    description: "Recognising powerful and memorable performances.",
    nominees: [
      { id: "actress-one", name: "Ama Serwaa", detail: "Film · Drama", accent: "#ed9d82" },
      { id: "actress-two", name: "Akosua Nyame", detail: "Television · Drama", accent: "#b5a4f5" },
      { id: "actress-three", name: "Nana Adjoa", detail: "Film · Comedy", accent: "#8da989" },
    ],
  },
  {
    id: "best-new-artist",
    name: "Best New Artist",
    description: "The breakthrough voices shaping what comes next.",
    nominees: [
      { id: "new-artist-one", name: "Gyakie", detail: "Afrobeats · Soul", accent: "#ed9d82" },
      { id: "new-artist-two", name: "Camidoh", detail: "Afrobeats · R&B", accent: "#88c6d9" },
      { id: "new-artist-three", name: "Lasmid", detail: "Afrobeats · Highlife", accent: "#b5a4f5" },
    ],
  },
  {
    id: "best-group",
    name: "Best Group",
    description: "The collaborations and collectives raising the bar.",
    nominees: [
      { id: "group-one", name: "DopeNation", detail: "Music group", accent: "#8da989" },
      { id: "group-two", name: "R2Bees", detail: "Music group", accent: "#f3c96b" },
      { id: "group-three", name: "La Même Gang", detail: "Music collective", accent: "#b5a4f5" },
    ],
  },
  {
    id: "lifetime-achievement",
    name: "Lifetime Achievement",
    description: "A tribute to lasting influence and extraordinary contribution.",
    nominees: [
      { id: "legacy-one", name: "The Legacy Honouree", detail: "Lifetime contribution", accent: "#f3c96b" },
      { id: "legacy-two", name: "The Culture Keeper", detail: "Lifetime contribution", accent: "#b5a4f5" },
    ],
  },
];

export const votePackages = [
  { votes: 1, price: 2 },
  { votes: 5, price: 8 },
  { votes: 10, price: 15 },
  { votes: 20, price: 25 },
] as const;

export function getNominee(nomineeId: string, registeredNominees: RegisteredNominee[] = []) {
  for (const category of categories) {
    const nominee = category.nominees.find((item) => item.id === nomineeId);
    if (nominee) return { nominee, category };
  }
  const registered = registeredNominees.find((nominee) => nominee.id === nomineeId);
  if (registered) {
    const category = categories.find((item) => item.id === registered.categoryId);
    if (category) return { nominee: registered, category };
  }
  return undefined;
}
