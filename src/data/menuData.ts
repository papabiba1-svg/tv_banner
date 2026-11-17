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
  cateringEnabled?: boolean; // show catering promo slide in carousel
  cateringDuration?: number; // seconds, default 15
  showEveryNDishes?: number; // promo after every N dishes, default 3
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

/**
 * Resolves relative asset paths against import.meta.env.BASE_URL
 * Ensures images and data files work seamlessly when deployed to GitHub Pages subfolders (e.g. /tv_banner/)
 */
export const resolveAssetUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanPath = url.replace(/^\.?\//, '');
  return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}${cleanPath}`;
};

export const MENU_CONFIG: MenuBoardConfig = {
  restaurantName: "MTA FOOD HOUSE",
  slogan: "Frisch zubereitet • Authentischer Geschmack",
  logoUrl: "./logo.png",
  slideDurationSeconds: 9, // 8-10 seconds recommended for TV menu boards
  autoPlay: true,
  currency: "€",
  phoneOrWifi: "Free Wi-Fi: MTA-Guest",
  cateringEnabled: true,
  cateringDuration: 15,
  showEveryNDishes: 3,
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
  {
    id: "wareniki-fleisch",
    orderNumber: "1.",
    name: "Wareniki mit Fleischfüllung",
    subtitle: "Der beliebte osteuropäische Klassiker",
    description: "Handgemachte Teigtaschen mit saftiger Hähnchenfleischfüllung, serviert mit goldbraun gebratenen Röstzwiebeln und hausgemachtem Joghurt-Dip.",
    price: 12.0,
    priceFormatted: "12,00 €",
    categoryId: "wareniki-pelmeni",
    image: "./dishes/vareniki-s-mjasom-removebg-preview.png",
    badge: "Hausrezept",
    badgeType: "green",
    allergens: "Allergene: A (Weizen), G (Milch / Laktose)",
    portion: "9 Stück",
    isVegetarian: false,
    isBestseller: true,
    isAvailable: true,
    tags: ["Hausgemacht", "Tradition"],
  },
  {
    id: "wareniki-mit-kartofel-9164",
    orderNumber: "2.",
    name: "Wareniki mit Kartofel",
    description: "Mit gebratenen Zwiebeln und Joghurt-Dip",
    price: 8.0,
    priceFormatted: "8,00 €",
    categoryId: "wareniki-pelmeni",
    image: "./dishes/dish-wareniki-mit-kartofel-9164.png",
    badgeType: "yellow",
    allergens: "Allergene: A (Weizen), G (Milch)",
    portion: "9 St.",
    isVegetarian: false,
    isSpicy: false,
    isBestseller: false,
    isAvailable: true,
    tags: ["Hausgemacht"],
  },
  {
    id: "tschibureki-mit-rindfleisch-0415",
    orderNumber: "3.",
    name: "Tschibureki mit Rindfleisch",
    description: "Saftige Rindfleischfüllung im knusprigen Teig.",
    price: 5.0,
    priceFormatted: "5,00 €",
    categoryId: "wareniki-pelmeni",
    image: "./dishes/dish-tschibureki-mit-rindfleisch-0415.png",
    badgeType: "yellow",
    allergens: "Allergene: A (Weizen), C (Eier)",
    portion: "1 St.",
    isVegetarian: false,
    isSpicy: false,
    isBestseller: true,
    isAvailable: true,
    tags: ["Hausgemacht"],
  },
  {
    id: "double-burger-1975",
    orderNumber: "4.",
    name: "Double Burger",
    description: "Zwei Rindfleisch-Patties, doppelter Cheddar und Burgersauce.",
    price: 9.0,
    priceFormatted: "9,00 €",
    categoryId: "wareniki-pelmeni",
    image: "./dishes/dish-double-burger-1975.png",
    badgeType: "yellow",
    allergens: "Allergene: A (Weizen), C (Eier), G (Milch / Laktose), M (Senf)",
    isVegetarian: false,
    isSpicy: false,
    isBestseller: true,
    isAvailable: true,
    tags: ["Hausgemacht"],
  },
];
