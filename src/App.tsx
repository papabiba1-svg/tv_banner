import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DishShowcase } from './components/DishShowcase';
import { KioskControls } from './components/KioskControls';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import {
  CATEGORIES as DEFAULT_CATEGORIES,
  MENU_ITEMS as DEFAULT_ITEMS,
  MENU_CONFIG as DEFAULT_CONFIG,
  resolveAssetUrl,
} from './data/menuData';
import type { Category, Dish, MenuBoardConfig, MenuDataPayload } from './data/menuData';
import type { GitHubSettings } from './services/githubApi';
import {
  getStoredSettings,
  saveStoredSettings,
} from './services/githubApi';
import {
  getStoredMenuData,
  saveStoredMenuData,
} from './services/menuStorage';
import { initScreenWakeLock } from './services/wakeLock';

export const App: React.FC = () => {
  // Menu data state: initialize directly from localStorage to ensure user-added dishes and images persist across refreshes
  const [config, setConfig] = useState<MenuBoardConfig>(() => {
    const local = getStoredMenuData();
    return local?.config || DEFAULT_CONFIG;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const local = getStoredMenuData();
    return local?.categories?.length ? local.categories : DEFAULT_CATEGORIES;
  });
  const [allItems, setAllItems] = useState<Dish[]>(() => {
    const local = getStoredMenuData();
    return local?.items?.length ? local.items : DEFAULT_ITEMS;
  });

  // TV display slider state
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
        path.endsWith('/admin/') ||
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

  // Screen Wake Lock & Keep-Alive to prevent Fire TV / Android TV from entering sleep mode
  useEffect(() => {
    const cleanupWakeLock = initScreenWakeLock();
    return () => {
      cleanupWakeLock();
    };
  }, []);

  // Fetch public/data/menuData.json with timestamp cache busting & BASE_URL resolution
  const loadRemoteMenuData = useCallback(async () => {
    try {
      const dataUrl = resolveAssetUrl('data/menuData.json') + `?_t=${Date.now()}`;
      const res = await fetch(dataUrl, {
        cache: 'no-store',
      });
      if (res.ok) {
        const payload: MenuDataPayload = await res.json();
        const local = getStoredMenuData();

        // If local user data exists, check timestamps to never overwrite newer local additions
        if (local && local.updatedAt && payload.updatedAt) {
          const localTime = new Date(local.updatedAt).getTime();
          const remoteTime = new Date(payload.updatedAt).getTime();
          if (remoteTime <= localTime) {
            // Local user modifications in localStorage are newer or equal; preserve them
            return;
          }
        }

        if (payload.config) {
          setConfig(payload.config);
          if (payload.config.slideDurationSeconds) {
            setSlideDuration(payload.config.slideDurationSeconds);
          }
        }
        if (payload.categories && Array.isArray(payload.categories) && payload.categories.length > 0) {
          setCategories(payload.categories);
        }
        if (payload.items && Array.isArray(payload.items) && payload.items.length > 0) {
          setAllItems(payload.items);
        }

        // Cache latest remote payload into localStorage
        saveStoredMenuData({
          config: payload.config,
          categories: payload.categories,
          items: payload.items || [],
          updatedAt: payload.updatedAt,
        });
      }
    } catch (err) {
      console.warn('Fallback to local/cached menu data:', err);
    }
  }, []);

  // Initial load and periodic background poll every 60s
  useEffect(() => {
    loadRemoteMenuData();

    const pollInterval = setInterval(() => {
      loadRemoteMenuData();
    }, 60000);

    return () => clearInterval(pollInterval);
  }, [loadRemoteMenuData]);

  // Display dishes: only available items, fallback to all if none explicitly available
  const availableDishes: Dish[] = allItems.filter(
    (item) => item.isAvailable !== false
  );
  const displayDishes: Dish[] =
    availableDishes.length > 0 ? availableDishes : allItems;

  const currentDish: Dish | undefined =
    displayDishes[currentDishIndex] || displayDishes[0] || allItems[0];

  // Advance to next dish
  const handleNextDish = useCallback(() => {
    setDirection(1);
    setProgressPercent(0);
    setCurrentDishIndex((prevIndex) => {
      if (displayDishes.length <= 1) return 0;
      return (prevIndex + 1) % displayDishes.length;
    });
  }, [displayDishes.length]);

  // Back to previous dish
  const handlePrevDish = useCallback(() => {
    setDirection(-1);
    setProgressPercent(0);
    setCurrentDishIndex((prevIndex) => {
      if (displayDishes.length <= 1) return 0;
      return (prevIndex - 1 + displayDishes.length) % displayDishes.length;
    });
  }, [displayDishes.length]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Admin shortcut: Ctrl + Shift + A or Alt + A
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'A' || e.key === 'a'))
      ) {
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
    <div className="fixed inset-0 w-screen h-screen overflow-hidden signage-bg flex flex-col justify-between select-none font-sans text-[#FDFBF7]">
      
      {/* 1. Header: Clean & Minimalist Full-Width Bar (Logo + MTA FOOD HOUSE + Clock) */}
      <Header
        config={config}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* 2. Main Center Body: Full-Screen 100vw Hero Showcase */}
      <main className="relative flex-1 min-h-0 w-full h-full flex items-center justify-center overflow-hidden">
        {currentDish ? (
          <DishShowcase dish={currentDish} direction={direction} />
        ) : (
          <div className="w-full flex items-center justify-center text-[#F4C414] font-bold text-3xl">
            Keine Gerichte verfügbar.
          </div>
        )}
      </main>

      {/* 3. Bottom Edge: Full-Width Timer Progress Bar & MTA Ribbon */}
      <div className="w-full flex-shrink-0 z-20">
        <div className="w-full h-[0.5vh] min-h-[4px] bg-white/10 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#F4C414] via-[#FFE066] to-[#F4C414] transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="h-[0.7vh] min-h-[5px] w-full mta-stripes-slim" />
      </div>

      {/* 4. Hidden Floating Kiosk TV Controls (auto-hides on idle) */}
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

      {/* 5. TV Mode Hint Toast (Discreetly notifies staff in German) */}
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

      {/* 6. Admin Auth Modal (Russian) */}
      {showAuthModal && (
        <AdminAuthModal
          initialSettings={ghSettings}
          onSuccess={handleAuthSuccess}
          onCancel={handleCloseAdmin}
        />
      )}

      {/* 7. Full Admin Panel Overlay (Russian) */}
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
            saveStoredMenuData(payload);
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
