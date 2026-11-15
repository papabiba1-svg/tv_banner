import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DishShowcase } from './components/DishShowcase';
import { CategoryBar } from './components/CategoryBar';
import { CategoryPreviewList } from './components/CategoryPreviewList';
import { KioskControls } from './components/KioskControls';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import {
  CATEGORIES as DEFAULT_CATEGORIES,
  MENU_ITEMS as DEFAULT_ITEMS,
  MENU_CONFIG as DEFAULT_CONFIG,
} from './data/menuData';
import type { Category, Dish, MenuBoardConfig, MenuDataPayload } from './data/menuData';
import type { GitHubSettings } from './services/githubApi';
import {
  getStoredSettings,
  saveStoredSettings,
} from './services/githubApi';

export const App: React.FC = () => {
  // Menu data state (initialized with local defaults, then loaded from public/data/menuData.json)
  const [config, setConfig] = useState<MenuBoardConfig>(DEFAULT_CONFIG);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [allItems, setAllItems] = useState<Dish[]>(DEFAULT_ITEMS);

  // TV display slider state
  const [selectedCategory, setSelectedCategory] = useState<Category>(DEFAULT_CATEGORIES[0]);
  const [currentDishIndex, setCurrentDishIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [slideDuration, setSlideDuration] = useState<number>(
    DEFAULT_CONFIG.slideDurationSeconds || 9
  );
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showKioskToast, setShowKioskToast] = useState<boolean>(true);

  // Admin state
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [ghSettings, setGhSettings] = useState<GitHubSettings>(getStoredSettings());

  // Check URL route for /admin or #/admin
  useEffect(() => {
    const checkAdminRoute = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const search = window.location.search;

      if (
        hash === '#/admin' ||
        hash === '#admin' ||
        path.endsWith('/admin') ||
        search.includes('admin')
      ) {
        handleOpenAdmin();
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, []);

  // Fetch public/data/menuData.json with timestamp cache busting
  const loadRemoteMenuData = useCallback(async () => {
    try {
      const res = await fetch(`./data/menuData.json?_t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const payload: MenuDataPayload = await res.json();
        if (payload.config) {
          setConfig(payload.config);
          if (payload.config.slideDurationSeconds) {
            setSlideDuration(payload.config.slideDurationSeconds);
          }
        }
        if (payload.categories && payload.categories.length > 0) {
          setCategories(payload.categories);
          // Keep active category in sync if possible
          setSelectedCategory((prev) => {
            const match = payload.categories.find((c) => c.id === prev.id);
            return match || payload.categories[0];
          });
        }
        if (payload.items && payload.items.length > 0) {
          setAllItems(payload.items);
        }
      }
    } catch (err) {
      console.warn('Fallback to local menuData.ts because remote menuData.json could not be loaded:', err);
    }
  }, []);

  // Initial load and periodic background poll every 60s
  useEffect(() => {
    loadRemoteMenuData();

    // Auto-poll in background so TV updates without reloading
    const pollInterval = setInterval(() => {
      loadRemoteMenuData();
    }, 60000);

    return () => clearInterval(pollInterval);
  }, [loadRemoteMenuData]);

  // Dishes filtered by current category & only available dishes (isAvailable !== false)
  const availableDishesInCategory: Dish[] = allItems.filter(
    (item) => item.categoryId === selectedCategory.id && item.isAvailable !== false
  );

  // Fallback to any dish in category if none is marked available
  const dishesInCurrentCategory: Dish[] =
    availableDishesInCategory.length > 0
      ? availableDishesInCategory
      : allItems.filter((item) => item.categoryId === selectedCategory.id);

  const currentDish: Dish =
    dishesInCurrentCategory[currentDishIndex] || dishesInCurrentCategory[0] || allItems[0];

  // Advance to next dish
  const handleNextDish = useCallback(() => {
    setDirection(1);
    setProgressPercent(0);
    setCurrentDishIndex((prevIndex) => {
      if (prevIndex + 1 < dishesInCurrentCategory.length) {
        return prevIndex + 1;
      } else {
        // Loop to next category when current category completes
        const currentCatIndex = categories.findIndex(
          (c) => c.id === selectedCategory.id
        );
        const nextCatIndex = (currentCatIndex + 1) % categories.length;
        setSelectedCategory(categories[nextCatIndex]);
        return 0;
      }
    });
  }, [dishesInCurrentCategory.length, categories, selectedCategory.id]);

  // Back to previous dish
  const handlePrevDish = useCallback(() => {
    setDirection(-1);
    setProgressPercent(0);
    setCurrentDishIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      } else {
        const currentCatIndex = categories.findIndex(
          (c) => c.id === selectedCategory.id
        );
        const prevCatIndex =
          (currentCatIndex - 1 + categories.length) % categories.length;
        setSelectedCategory(categories[prevCatIndex]);
        const prevCatDishes = allItems.filter(
          (item) => item.categoryId === categories[prevCatIndex].id && item.isAvailable !== false
        );
        return Math.max(0, prevCatDishes.length - 1);
      }
    });
  }, [categories, selectedCategory.id, allItems]);

  // Select a category manually
  const handleSelectCategory = (category: Category) => {
    if (category.id !== selectedCategory.id) {
      setDirection(1);
      setSelectedCategory(category);
      setCurrentDishIndex(0);
      setProgressPercent(0);
    }
  };

  // Select a dish index manually
  const handleSelectDishIndex = (index: number) => {
    setDirection(index > currentDishIndex ? 1 : -1);
    setCurrentDishIndex(index);
    setProgressPercent(0);
  };

  // Fullscreen toggle logic
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn('Exit fullscreen error:', err);
        });
      }
    }
  }, []);

  // Admin open & close triggers
  const handleOpenAdmin = () => {
    const isAuthed = sessionStorage.getItem('mta_admin_session_auth') === 'true';
    if (isAuthed) {
      setIsAdminOpen(true);
      window.location.hash = '#/admin';
    } else {
      setShowAuthModal(true);
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    setShowAuthModal(false);
    if (window.location.hash.includes('admin')) {
      window.location.hash = '';
    }
  };

  const handleAuthSuccess = (newSettings: GitHubSettings) => {
    setGhSettings(newSettings);
    sessionStorage.setItem('mta_admin_session_auth', 'true');
    setShowAuthModal(false);
    setIsAdminOpen(true);
    window.location.hash = '#/admin';
  };

  // Listen to keyboard shortcuts: F for fullscreen, Ctrl+Shift+A for Admin
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Admin shortcut: Ctrl + Shift + A or Alt + A
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        handleOpenAdmin();
        return;
      }

      if (isAdminOpen) return; // Ignore TV shortcuts when Admin is active

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        handleNextDish();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevDish();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleFullscreen, handleNextDish, handlePrevDish, isAdminOpen]);

  // Toast message timer for TV Kiosk shortcut hint
  useEffect(() => {
    const toastTimer = setTimeout(() => {
      setShowKioskToast(false);
    }, 6000);
    return () => clearTimeout(toastTimer);
  }, []);

  // Main TV Slide Timer (Tick every 100ms for smooth progress bar)
  useEffect(() => {
    if (isPaused || isAdminOpen) return;

    const intervalMs = 100;
    const totalTicks = (slideDuration * 1000) / intervalMs;

    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + 100 / totalTicks;
        if (next >= 100) {
          handleNextDish();
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, isAdminOpen, slideDuration, handleNextDish]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F9F6E8] cream-pattern flex flex-col justify-between font-sans select-none">
      
      {/* 1. Header with Diagonal Stripes, Round Logo & Category Title */}
      <Header
        currentCategory={selectedCategory}
        config={config}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        dishCount={dishesInCurrentCategory.length}
        currentDishIndex={currentDishIndex}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* 2. Main Center Body: Hero Showcase & Optional Preview Sidebar */}
      <main className="relative flex-1 w-full flex items-center justify-between overflow-hidden">
        {currentDish ? (
          <DishShowcase dish={currentDish} direction={direction} />
        ) : (
          <div className="w-full flex items-center justify-center text-[#005826] font-bold text-xl">
            Keine Gerichte in dieser Kategorie verfügbar.
          </div>
        )}

        {/* Right-hand side menu glance for TV viewers */}
        <CategoryPreviewList
          dishes={dishesInCurrentCategory}
          currentDishIndex={currentDishIndex}
          onSelectDish={handleSelectDishIndex}
        />
      </main>

      {/* 3. Bottom Bar: Countdown Timer, Category Switcher & Dish Dots */}
      <CategoryBar
        categories={categories}
        currentCategory={selectedCategory}
        dishesInCurrentCategory={dishesInCurrentCategory}
        currentDishIndex={currentDishIndex}
        onSelectCategory={handleSelectCategory}
        onSelectDishIndex={handleSelectDishIndex}
        progressPercent={progressPercent}
        isPaused={isPaused}
      />

      {/* 4. Hidden / Floating Kiosk TV Controls (auto-hides on idle) */}
      <KioskControls
        isPaused={isPaused}
        onTogglePlay={() => setIsPaused(!isPaused)}
        onPrev={handlePrevDish}
        onNext={handleNextDish}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        slideDuration={slideDuration}
        onChangeDuration={(sec) => {
          setSlideDuration(sec);
          setProgressPercent(0);
        }}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* 5. TV Mode Hint Toast (Discreetly notifies staff) */}
      {showKioskToast && !isFullscreen && !isAdminOpen && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#005826]/90 text-[#F9F6E8] text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-[#F4C414]/40 backdrop-blur-md flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#F4C414]" />
          <span>Tipp: Klicken Sie auf das Logo oder drücken Sie [F] für Vollbild</span>
          <button
            onClick={() => setShowKioskToast(false)}
            className="ml-2 text-[#F4C414] hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 6. Admin Auth Modal (PIN / GitHub Token) */}
      {showAuthModal && (
        <AdminAuthModal
          initialSettings={ghSettings}
          onSuccess={handleAuthSuccess}
          onCancel={handleCloseAdmin}
        />
      )}

      {/* 7. Full Admin Panel Overlay */}
      {isAdminOpen && (
        <AdminPanel
          initialConfig={config}
          initialCategories={categories}
          initialItems={allItems}
          ghSettings={ghSettings}
          onUpdateMenuData={(payload) => {
            if (payload.config) setConfig(payload.config);
            if (payload.categories) setCategories(payload.categories);
            if (payload.items) setAllItems(payload.items);
          }}
          onCloseAdmin={handleCloseAdmin}
          onUpdateGhSettings={(newSettings) => {
            setGhSettings(newSettings);
            saveStoredSettings(newSettings);
          }}
        />
      )}

    </div>
  );
};

export default App;
