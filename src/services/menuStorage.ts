import type { Dish, Category, MenuBoardConfig } from '../data/menuData';
import {
  MENU_CONFIG as DEFAULT_CONFIG,
  CATEGORIES as DEFAULT_CATEGORIES,
} from '../data/menuData';

export const STORAGE_KEY_MENU_DATA = 'mta_menu_board_data_v1';

export interface StoredMenuData {
  config: MenuBoardConfig;
  categories: Category[];
  items: Dish[];
  updatedAt: string;
}

/**
 * Retrieves cached/saved menu data from localStorage.
 * Ensures that dishes, prices, descriptions, and base64 images survive browser reloads.
 */
export function getStoredMenuData(): StoredMenuData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MENU_DATA);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return null;

    return {
      config: parsed.config || DEFAULT_CONFIG,
      categories:
        Array.isArray(parsed.categories) && parsed.categories.length > 0
          ? parsed.categories
          : DEFAULT_CATEGORIES,
      items: parsed.items,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Failed to parse menu data from localStorage:', err);
    return null;
  }
}

/**
 * Persists menu data directly to localStorage.
 * Returns true on success, false if quota is exceeded.
 */
export function saveStoredMenuData(payload: {
  config?: MenuBoardConfig;
  categories?: Category[];
  items: Dish[];
  updatedAt?: string;
}): boolean {
  try {
    const current = getStoredMenuData();
    const dataToStore: StoredMenuData = {
      config: payload.config || current?.config || DEFAULT_CONFIG,
      categories: payload.categories || current?.categories || DEFAULT_CATEGORIES,
      items: payload.items,
      updatedAt: payload.updatedAt || new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_MENU_DATA, JSON.stringify(dataToStore));
    return true;
  } catch (err) {
    console.error('Failed to write menu data to localStorage:', err);
    return false;
  }
}

/**
 * Explicitly clears the localStorage cache, returning to initial defaults.
 */
export function clearStoredMenuData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_MENU_DATA);
  } catch (err) {
    console.warn('Failed to clear menu data from localStorage:', err);
  }
}
