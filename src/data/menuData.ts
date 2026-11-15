export interface Dish {
  id: string;
  orderNumber: string; // e.g. "01", "02" or "1."
  name: string;
  subtitle?: string;
  description: string;
  price: number;
  priceFormatted: string; // e.g. "9,90 €"
  categoryId: string;
  image: string;
  badge?: string;
  badgeType?: 'yellow' | 'green' | 'red';
  allergens?: string;
  portion?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isBestseller?: boolean;
  isAvailable?: boolean; // toggle visibility in kiosk (hide when out of stock)
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  code: string;
}

export interface MenuBoardConfig {
  restaurantName: string;
  slogan: string;
  logoUrl: string;
  slideDurationSeconds: number; // default interval between dish changes
  autoPlay: boolean;
  currency: string;
  phoneOrWifi?: string;
}

export interface MenuDataPayload {
  config: MenuBoardConfig;
  categories: Category[];
  items: Dish[];
  updatedAt?: string;
}

export const formatEuroPrice = (val: number): string => {
  return val.toFixed(2).replace('.', ',') + ' €';
};

export const MENU_CONFIG: MenuBoardConfig = {
  restaurantName: "MTA FOOD HOUSE",
  slogan: "Frisch zubereitet • Authentischer Geschmack",
  logoUrl: "./logo.png",
  slideDurationSeconds: 9, // 8-10 seconds recommended for TV menu boards
  autoPlay: true,
  currency: "€",
  phoneOrWifi: "Free Wi-Fi: MTA-Guest",
};

export const CATEGORIES: Category[] = [
  {
    id: "wareniki-pelmeni",
    name: "Wareniki & Pelmeni",
    subtitle: "Traditionelle Teigtaschen nach originalem Hausrezept",
    code: "WP",
  },
  {
    id: "burgers",
    name: "Burgers & Sandwiches",
    subtitle: "Saftiges 100% Angus Rindfleisch & knuspriges Brioche",
    code: "BG",
  },
  {
    id: "suppen-special",
    name: "Suppen & Spezialitäten",
    subtitle: "Herzhafte Klassiker & erfrischende Durstlöscher",
    code: "SP",
  },
];

export const MENU_ITEMS: Dish[] = [
  // Category 1: Wareniki & Pelmeni
  {
    id: "wareniki-kartoffel",
    orderNumber: "1.",
    name: "Wareniki mit Kartoffel",
    subtitle: "Der beliebte osteuropäische Klassiker",
    description: "Zarte Teigtaschen gefüllt mit samtigem Kartoffelpüree, garniert mit knusprig gebratenen Röstzwiebeln, frischen Gartenkräutern und hausgemachtem Joghurt-Dip.",
    price: 9.90,
    priceFormatted: "9,90 €",
    categoryId: "wareniki-pelmeni",
    image: "./dishes/wareniki-kartoffel.png",
    badge: "Bestseller",
    badgeType: "yellow",
    allergens: "Allergene: A (Weizen), G (Milch / Laktose)",
    portion: "10 Stück • 320g",
    isVegetarian: true,
    isBestseller: true,
    isAvailable: true,
    tags: ["Vegetarisch", "Hausgemacht", "Tradition"],
  },
  {
    id: "pelmeni-sibirisch",
    orderNumber: "2.",
    name: "Sibirische Pelmeni",
    subtitle: "Herzhafte Rind- & Schweinefleischfüllung",
    description: "Klassische handgeformte Pelmeni mit saftiger Füllung aus erlesenem Fleisch, geschmolzener Bauernbutter, frisch gemahlenem schwarzem Pfeffer, Petersilie und Sauerrahm.",
    price: 11.50,
    priceFormatted: "11,50 €",
    categoryId: "wareniki-pelmeni",
    image: "./dishes/pelmeni-sibirisch.png",
    badge: "Hausrezept",
    badgeType: "green",
    allergens: "Allergene: A (Weizen), C (Ei), G (Milch)",
    portion: "15 Stück • 340g",
    isBestseller: true,
    isAvailable: true,
    tags: ["100% Fleisch", "Frisch gekocht", "Tradition"],
  },
  {
    id: "pelmeni-gebraten",
    orderNumber: "3.",
    name: "Gebratene Pelmeni Crispy",
    subtitle: "Knusprig in der Pfanne goldbraun geschwenkt",
    description: "In Sesamöl kross angebratene Fleischpelmeni, bestreut mit Frühlingszwiebeln und geröstetem Sesam, serviert mit würzigem Paprika-Knoblauch-Dip.",
    price: 12.20,
    priceFormatted: "12,20 €",
    categoryId: "wareniki-pelmeni",
    image: "./dishes/pelmeni-gebraten.png",
    badge: "Chef-Tipp",
    badgeType: "yellow",
    allergens: "Allergene: A (Weizen), C (Ei), K (Sesam)",
    portion: "14 Stück • 330g",
    isSpicy: true,
    isAvailable: true,
    tags: ["Extra Knusprig", "Würziger Dip"],
  },
  {
    id: "wareniki-kirsche",
    orderNumber: "4.",
    name: "Wareniki mit Sauerkirschen",
    subtitle: "Süßer Fruchttraum nach Großmutters Art",
    description: "Süße handgemachte Teigtaschen mit saftigen Sauerkirschen, serviert mit Bourbon-Puderzucker, frischer Minze und samtigem Kirsch-Fruchtspiegel.",
    price: 10.50,
    priceFormatted: "10,50 €",
    categoryId: "wareniki-pelmeni",
    image: "./dishes/wareniki-kirsche.png",
    badge: "Süße Verführung",
    badgeType: "yellow",
    allergens: "Allergene: A (Weizen), G (Milch)",
    portion: "8 Stück • 290g",
    isVegetarian: true,
    isAvailable: true,
    tags: ["Dessert", "Vegetarisch", "Fruchtig"],
  },

  // Category 2: Burgers & Sandwiches
  {
    id: "burger-house",
    orderNumber: "5.",
    name: "MTA House Burger",
    subtitle: "Unser legendärer Signature-Burger",
    description: "200g feinstes Black Angus Beef auf getoastetem Brioche-Bun, geschmolzener Vintage Cheddar, krosser Bacon, Strauchtomaten, Essiggurken, karamellisierte Zwiebeln & MTA Spezial-Sauce.",
    price: 13.90,
    priceFormatted: "13,90 €",
    categoryId: "burgers",
    image: "./dishes/burger-house.png",
    badge: "Top Seller",
    badgeType: "yellow",
    allergens: "Allergene: A (Weizen), C (Ei), G (Milch), J (Senf)",
    portion: "Inkl. Pommes Frites • 450g",
    isBestseller: true,
    isAvailable: true,
    tags: ["Black Angus", "Inkl. Beilage", "Brioche"],
  },
  {
    id: "burger-crispy-chicken",
    orderNumber: "6.",
    name: "Crispy Buttermilk Chicken Burger",
    subtitle: "Extra kross paniertes Hähnchenfilet",
    description: "Goldbraun gebackenes Hähnchenbrustfilet in Buttermilch-Panade, hausgemachter Rotkohl-Coleslaw, geschmolzener Käse, knackiger Salat & Smoky Honey-Mustard Cream.",
    price: 12.90,
    priceFormatted: "12,90 €",
    categoryId: "burgers",
    image: "./dishes/burger-crispy-chicken.png",
    badge: "Neuheit",
    badgeType: "green",
    allergens: "Allergene: A (Weizen), C (Ei), G (Milch), J (Senf)",
    portion: "Inkl. Pommes Frites • 420g",
    isAvailable: true,
    tags: ["Knusprig", "Zartes Hähnchen", "Hausgemacht"],
  },

  // Category 3: Suppen & Spezialitäten
  {
    id: "borsch-traditionell",
    orderNumber: "7.",
    name: "Traditioneller Borschtsch",
    subtitle: "Mit zartem Rindfleisch & Pampuschka",
    description: "Kräftig gekochte Rote-Bete-Suppe mit zart gegartem Rindfleisch, frischem Kohl, Kartoffeln, Dill und einem großzügigen Löffel Crème fraîche. Serviert mit heißem Knoblauch-Hefegebäck.",
    price: 9.50,
    priceFormatted: "9,50 €",
    categoryId: "suppen-special",
    image: "./dishes/borsch-traditionell.png",
    badge: "Heiß & Herzhaft",
    badgeType: "green",
    allergens: "Allergene: A (Weizen), G (Milch), I (Sellerie)",
    portion: "450ml • Inkl. 1 Pampuschka",
    isAvailable: true,
    tags: ["Traditionssuppe", "Heiß serviert", "Mit Knoblauchbrot"],
  },
  {
    id: "hausgemachte-limonade",
    orderNumber: "8.",
    name: "MTA Hausgemachte Limonade",
    subtitle: "Eiskalt & natürlich aromatisiert",
    description: "Frisch gepresster Zitronen- & Limettensaft mit marokkanischer Minze, leichtem Rohrzuckersirup und prickelndem Quellwasser auf Crushed Ice serviert.",
    price: 4.50,
    priceFormatted: "4,50 €",
    categoryId: "suppen-special",
    image: "./dishes/hausgemachte-limonade.png",
    badge: "100% Bio",
    badgeType: "yellow",
    allergens: "Ohne Allergene / Vegan",
    portion: "0,5 Liter",
    isVegetarian: true,
    isAvailable: true,
    tags: ["Erfrischend", "Ohne Konservierungsstoffe", "Eiskalt"],
  },
];
