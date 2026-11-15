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
];
