import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  CloudUpload,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Settings,
  Utensils,
  FolderTree,
  Lock,
} from 'lucide-react';
import type { Dish, Category, MenuBoardConfig, MenuDataPayload } from '../../data/menuData';
import { DEFAULT_CATERING_TITLE, DEFAULT_CATERING_SUBTITLE } from '../../data/menuData';
import { formatEuroPrice, resolveAssetUrl } from '../../data/menuData';
import type { GitHubSettings } from '../../services/githubApi';
import {
  uploadOrUpdateGitHubFile,
  utf8ToBase64,
  saveStoredSettings,
  validateGitHubAccess,
} from '../../services/githubApi';
import {
  saveStoredMenuData,
  clearStoredMenuData,
} from '../../services/menuStorage';
import { DishEditorModal } from './DishEditorModal';

interface AdminPanelProps {
  initialConfig: MenuBoardConfig;
  initialCategories: Category[];
  initialItems: Dish[];
  ghSettings: GitHubSettings;
  onUpdateMenuData: (payload: MenuDataPayload) => void;
  onCloseAdmin: () => void;
  onUpdateGhSettings: (newSettings: GitHubSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  initialConfig,
  initialCategories,
  initialItems,
  ghSettings,
  onUpdateMenuData,
  onCloseAdmin,
  onUpdateGhSettings,
}) => {
  // Menu working copy state
  const [config, setConfig] = useState<MenuBoardConfig>(initialConfig);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [items, setItems] = useState<Dish[]>(initialItems);

  // Queued new images to commit to GitHub
  const [queuedImages, setQueuedImages] = useState<
    Array<{ base64: string; filename: string }>
  >([]);

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<'dishes' | 'categories' | 'catering' | 'settings'>('dishes');

  // Update a single config field and persist immediately (localStorage + App state)
  const updateConfigField = <K extends keyof MenuBoardConfig>(key: K, value: MenuBoardConfig[K]) => {
    const nextConfig = { ...config, [key]: value };
    setConfig(nextConfig);
    setHasUnsavedChanges(true);
    syncAndPersist(items, categories, nextConfig);
  };
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Modals & publishing state
  const [editingDish, setEditingDish] = useState<Dish | null | undefined>(undefined); // null = new, undefined = closed
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    commitUrl?: string;
  } | null>(null);

  // Settings form state
  const [settingsToken, setSettingsToken] = useState(ghSettings.token);
  const [settingsRepo, setSettingsRepo] = useState(ghSettings.repo);
  const [settingsBranch, setSettingsBranch] = useState(ghSettings.branch);
  const [settingsPin, setSettingsPin] = useState(ghSettings.pin);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  // Filtered dishes
  const filteredDishes = items.filter((dish) => {
    const matchesCategory =
      selectedCategoryFilter === 'all' || dish.categoryId === selectedCategoryFilter;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.orderNumber.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Immediate persistence helper: syncs directly to localStorage & updates parent App state
  const syncAndPersist = (
    nextItems: Dish[],
    nextCategories: Category[] = categories,
    nextConfig: MenuBoardConfig = config
  ) => {
    const updatedAt = new Date().toISOString();
    const payload: MenuDataPayload = {
      config: nextConfig,
      categories: nextCategories,
      items: nextItems,
      updatedAt,
    };
    saveStoredMenuData(payload);
    onUpdateMenuData(payload);
  };

  // Toggle dish availability (В наличии / Скрыто)
  const handleToggleAvailability = (dishId: string) => {
    const next = items.map((d) => (d.id === dishId ? { ...d, isAvailable: d.isAvailable === false } : d));
    setItems(next);
    setHasUnsavedChanges(true);
    syncAndPersist(next);
  };

  // Quick inline price change
  const handleQuickPriceChange = (dishId: string, delta: number) => {
    const next = items.map((d) => {
      if (d.id === dishId) {
        const newPrice = Math.max(0.5, Math.round((d.price + delta) * 10) / 10);
        return {
          ...d,
          price: newPrice,
          priceFormatted: formatEuroPrice(newPrice),
        };
      }
      return d;
    });
    setItems(next);
    setHasUnsavedChanges(true);
    syncAndPersist(next);
  };

  // Delete dish
  const handleDeleteDish = (dishId: string) => {
    const dish = items.find((d) => d.id === dishId);
    if (window.confirm(`Вы уверены, что хотите удалить блюдо "${dish?.name || dishId}"?`)) {
      const next = items.filter((d) => d.id !== dishId);
      setItems(next);
      setHasUnsavedChanges(true);
      syncAndPersist(next);
    }
  };

  // Save dish from modal (new or edited)
  const handleSaveDishFromModal = (
    savedDish: Dish,
    newImage?: { base64: string; filename: string }
  ) => {
    if (newImage) {
      setQueuedImages((prev) => [...prev, newImage]);
    }

    const exists = items.some((d) => d.id === savedDish.id);
    const next = exists
      ? items.map((d) => (d.id === savedDish.id ? savedDish : d))
      : [...items, savedDish];

    setItems(next);
    setEditingDish(undefined);
    setHasUnsavedChanges(true);
    syncAndPersist(next);
  };

  // Category title / subtitle editor
  const handleUpdateCategory = (catId: string, name: string, subtitle: string) => {
    const nextCategories = categories.map((c) => (c.id === catId ? { ...c, name, subtitle } : c));
    setCategories(nextCategories);
    setHasUnsavedChanges(true);
    syncAndPersist(items, nextCategories);
  };

  // Reset to factory defaults (1 dish)
  const handleResetToFactoryDefaults = () => {
    if (
      window.confirm(
        'ВНИМАНИЕ: Вы действительно хотите сбросить меню к исходному состоянию (1 блюдо)? Все локально добавленные позиции будут удалены.'
      )
    ) {
      clearStoredMenuData();
      window.location.reload();
    }
  };

  // Save GitHub & PIN Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg('Проверка подключения к GitHub...');
    const check = await validateGitHubAccess(settingsToken, settingsRepo);
    if (!check.valid) {
      setSettingsMsg(`Ошибка: ${check.error}`);
      return;
    }

    const updated: GitHubSettings = {
      token: settingsToken.trim(),
      repo: settingsRepo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, ''),
      branch: (settingsBranch || check.defaultBranch || 'main').trim(),
      pin: settingsPin.trim() || '1234',
    };
    saveStoredSettings(updated);
    onUpdateGhSettings(updated);
    setSettingsMsg('✓ Настройки успешно сохранены!');
  };

  // MAIN: Save and Publish to GitHub REST API
  const handlePublishToGitHub = async () => {
    if (!ghSettings.token || !ghSettings.repo) {
      setActiveTab('settings');
      setPublishStatus({
        type: 'error',
        message: 'Пожалуйста, сначала укажите персональный токен GitHub и репозиторий в настройках.',
      });
      return;
    }

    setIsPublishing(true);
    setPublishStatus({
      type: 'info',
      message: 'Изменения отправляются в GitHub...',
    });

    try {
      const remoteItems: Dish[] = [...items];

      // 1. Process any dishes with Base64 photos and upload to public/dishes/{filename}
      for (let i = 0; i < remoteItems.length; i++) {
        const dish = remoteItems[i];
        if (dish.image && dish.image.startsWith('data:image/')) {
          const match = dish.image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
          if (match) {
            const ext = match[1].includes('webp')
              ? 'webp'
              : match[1].includes('jpeg') || match[1].includes('jpg')
              ? 'jpg'
              : 'png';
            const filename = `dish-${dish.id}.${ext}`;
            const base64Data = match[2];

            setPublishStatus({
              type: 'info',
              message: `Загрузка фотографии блюда: public/dishes/${filename}...`,
            });

            const imgResult = await uploadOrUpdateGitHubFile(
              ghSettings.repo,
              `public/dishes/${filename}`,
              base64Data,
              `Upload dish photo: ${filename}`,
              ghSettings.branch,
              ghSettings.token
            );

            if (imgResult.success) {
              remoteItems[i] = {
                ...dish,
                image: `./dishes/${filename}`,
              };
            }
          }
        }
      }

      // Also upload any queued images
      for (const img of queuedImages) {
        setPublishStatus({
          type: 'info',
          message: `Загрузка фотографии: public/dishes/${img.filename}...`,
        });
        await uploadOrUpdateGitHubFile(
          ghSettings.repo,
          `public/dishes/${img.filename}`,
          img.base64,
          `Upload dish photo: ${img.filename}`,
          ghSettings.branch,
          ghSettings.token
        );
      }

      // 2. Prepare payload for public/data/menuData.json
      const updatedAt = new Date().toISOString();
      const payload: MenuDataPayload = {
        config,
        categories,
        items: remoteItems,
        updatedAt,
      };

      const jsonString = JSON.stringify(payload, null, 2);
      const jsonBase64 = utf8ToBase64(jsonString);

      setPublishStatus({
        type: 'info',
        message: 'Обновление файла public/data/menuData.json в репозитории...',
      });

      const commitResult = await uploadOrUpdateGitHubFile(
        ghSettings.repo,
        'public/data/menuData.json',
        jsonBase64,
        `Update menu data (${new Date().toLocaleTimeString('ru-RU')})`,
        ghSettings.branch,
        ghSettings.token
      );

      if (!commitResult.success) {
        throw new Error(commitResult.error || 'Ошибка коммита в GitHub');
      }

      // 3. Update local state & localStorage with clean payload
      onUpdateMenuData(payload);
      saveStoredMenuData(payload);
      setQueuedImages([]);
      setHasUnsavedChanges(false);

      setPublishStatus({
        type: 'success',
        message:
          'Успешно опубликовано! GitHub Pages автоматически обновится в течение 1–2 минут.',
        commitUrl: commitResult.commitUrl,
      });
    } catch (err: any) {
      setPublishStatus({
        type: 'error',
        message: err.message || 'Произошла ошибка при публикации.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#F9F6E8] flex flex-col overflow-hidden select-none">
      
      {/* 1. Header with MTA Stripes & Controls */}
      <header className="relative w-full z-20 shadow-sm border-b-2 border-[#005826]/20 bg-[#F9F6E8]">
        <div className="h-2.5 w-full mta-stripes" />
        
        <div className="px-6 py-3 flex items-center justify-between flex-wrap gap-4">
          
          {/* Left: Back button + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onCloseAdmin}
              className="px-3.5 py-2 bg-white hover:bg-[#005826]/10 text-[#005826] border border-[#005826]/30 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
            >
              <ArrowLeft size={16} />
              <span>Вернуться к ТВ-меню</span>
            </button>

            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#005826] font-display uppercase leading-tight">
                MTA Панель управления
              </h2>
              <p className="text-[11px] text-[#005826]/70 font-semibold hidden sm:block">
                Редактирование меню, цен и прямая публикация на GitHub Pages
              </p>
            </div>
          </div>

          {/* Right: Publish Button & Status */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Сохранено в браузере
            </span>

            {hasUnsavedChanges && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold animate-pulse shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Ожидает публикации на GitHub
              </span>
            )}

            <button
              onClick={handlePublishToGitHub}
              disabled={isPublishing}
              className={`px-5 py-2.5 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                hasUnsavedChanges
                  ? 'bg-[#F4C414] text-[#005826] border-2 border-[#005826] hover:bg-[#FFE066] animate-pulse'
                  : 'bg-[#005826] text-[#F4C414] hover:bg-[#00421C]'
              } disabled:opacity-50`}
            >
              <CloudUpload size={18} />
              <span>
                {isPublishing ? 'Публикация...' : 'Сохранить и опубликовать'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 flex items-center gap-2 border-t border-[#005826]/10 bg-white/40">
          <button
            onClick={() => setActiveTab('dishes')}
            className={`py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'dishes'
                ? 'border-[#005826] text-[#005826]'
                : 'border-transparent text-[#005826]/60 hover:text-[#005826]'
            }`}
          >
            <Utensils size={15} />
            <span>Блюда ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'categories'
                ? 'border-[#005826] text-[#005826]'
                : 'border-transparent text-[#005826]/60 hover:text-[#005826]'
            }`}
          >
            <FolderTree size={15} />
            <span>Категории ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catering')}
            className={`py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'catering'
                ? 'border-[#005826] text-[#005826]'
                : 'border-transparent text-[#005826]/60 hover:text-[#005826]'
            }`}
          >
            <span>🍢</span>
            <span>Кейтеринг</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-[#005826] text-[#005826]'
                : 'border-transparent text-[#005826]/60 hover:text-[#005826]'
            }`}
          >
            <Settings size={15} />
            <span>GitHub и PIN</span>
          </button>
        </div>
      </header>

      {/* Status banner */}
      <AnimatePresence>
        {publishStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`px-6 py-2.5 text-xs font-bold flex items-center justify-between border-b ${
              publishStatus.type === 'success'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : publishStatus.type === 'error'
                ? 'bg-rose-100 text-rose-900 border-rose-300'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {publishStatus.type === 'success' ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{publishStatus.message}</span>
              {publishStatus.commitUrl && (
                <a
                  href={publishStatus.commitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline flex items-center gap-1 ml-2 text-[#005826]"
                >
                  <span>Посмотреть коммит на GitHub</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
            <button
              onClick={() => setPublishStatus(null)}
              title="Закрыть"
              className="text-black/60 hover:text-black font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Content Body */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl w-full mx-auto space-y-5">
        
        {/* TAB 1: DISHES */}
        {activeTab === 'dishes' && (
          <div className="space-y-4">
            {/* Top Toolbar: Search, Category Filters & Add Dish */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#005826]/15 shadow-sm">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-[#005826] text-[#F4C414]'
                      : 'bg-gray-100 text-[#005826] hover:bg-gray-200'
                  }`}
                >
                  Все ({items.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryFilter(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategoryFilter === c.id
                        ? 'bg-[#005826] text-[#F4C414]'
                        : 'bg-gray-100 text-[#005826] hover:bg-gray-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Search & Add button */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-3 top-2.5 text-[#005826]/50" size={15} />
                  <input
                    type="text"
                    placeholder="Поиск блюда..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-[#005826]/20 rounded-xl text-xs font-semibold text-[#005826] focus:outline-none focus:ring-2 focus:ring-[#005826]"
                  />
                </div>

                <button
                  onClick={() => setEditingDish(null)}
                  className="px-4 py-2 bg-[#005826] text-[#F4C414] hover:bg-[#00421C] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
                >
                  <Plus size={16} />
                  <span>Добавить блюдо</span>
                </button>
              </div>
            </div>

            {/* Dish Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDishes.map((dish) => {
                const category = categories.find((c) => c.id === dish.categoryId);
                const isAvailable = dish.isAvailable !== false;

                return (
                  <div
                    key={dish.id}
                    className={`bg-white rounded-2xl border transition-all shadow-sm flex flex-col justify-between p-4 ${
                      isAvailable
                        ? 'border-[#005826]/20 hover:border-[#005826]/50'
                        : 'border-rose-300 bg-rose-50/40 opacity-75'
                    }`}
                  >
                    <div>
                      {/* Top bar of card */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <img
                            src={resolveAssetUrl(dish.image)}
                            alt={dish.name}
                            className="w-full h-full object-contain filter drop-shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                resolveAssetUrl('./dishes/vareniki-s-mjasom-removebg-preview.png');
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-bold text-[#005826]">
                              {dish.orderNumber}
                            </span>
                            <span className="text-[11px] font-bold text-[#005826]/60 truncate">
                              {category?.name || dish.categoryId}
                            </span>
                          </div>

                          <h4 className="text-sm font-black text-[#005826] leading-tight truncate mt-0.5">
                            {dish.name}
                          </h4>

                          {dish.subtitle && (
                            <p className="text-[11px] text-[#D9AB07] font-bold truncate">
                              {dish.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Price Badge */}
                        <div className="bg-[#F4C414] text-[#005826] font-mono font-black text-sm px-2.5 py-1 rounded-lg border border-[#005826] shadow-sm">
                          {dish.priceFormatted}
                        </div>
                      </div>

                      {/* Description snippet */}
                      <p className="text-xs text-[#1E2922] font-medium line-clamp-2 leading-relaxed mb-3">
                        {dish.description}
                      </p>

                      {/* Badges / Allergens */}
                      <div className="flex items-center flex-wrap gap-1.5 mb-3">
                        {dish.badge && (
                          <span className="bg-[#005826] text-[#F9F6E8] text-[10px] font-black px-2 py-0.5 rounded uppercase">
                            {dish.badge}
                          </span>
                        )}
                        {dish.portion && (
                          <span className="bg-gray-100 text-[#005826] text-[10px] font-bold px-2 py-0.5 rounded">
                            {dish.portion}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom action controls */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      {/* Availability toggle switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(dish.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          isAvailable
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                        }`}
                      >
                        {isAvailable ? <Eye size={13} /> : <EyeOff size={13} />}
                        <span>{isAvailable ? 'В наличии' : 'Скрыто'}</span>
                      </button>

                      {/* Quick price adjusters */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickPriceChange(dish.id, -0.5)}
                          title="Уменьшить цену на 0.50 €"
                          className="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-[#005826] rounded-lg font-black text-xs"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickPriceChange(dish.id, 0.5)}
                          title="Увеличить цену на 0.50 €"
                          className="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-[#005826] rounded-lg font-black text-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Edit & Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingDish(dish)}
                          title="Редактировать блюдо"
                          className="p-1.5 hover:bg-[#005826]/10 text-[#005826] rounded-lg transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDish(dish.id)}
                          title="Удалить блюдо"
                          className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-[#005826]/15 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-[#005826] uppercase font-display">
                Управление категориями
              </h3>
              <p className="text-xs text-[#005826]/70">
                Названия категорий крупно отображаются в центральной части шапки телевизора.
              </p>

              <div className="space-y-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 bg-[#F9F6E8] rounded-xl border border-[#005826]/20 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#005826]">
                        Код: {cat.code} (ID: {cat.id})
                      </span>
                      <span className="text-xs font-bold text-[#005826]/60">
                        {items.filter((d) => d.categoryId === cat.id).length} позиций
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#005826] uppercase mb-1">
                        Название категории на ТВ (немецкий)
                      </label>
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) =>
                          handleUpdateCategory(cat.id, e.target.value, cat.subtitle)
                        }
                        className="w-full px-3 py-1.5 bg-white border border-[#005826]/30 rounded-lg text-sm font-black text-[#005826]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#005826] uppercase mb-1">
                        Подзаголовок категории на ТВ (немецкий)
                      </label>
                      <input
                        type="text"
                        value={cat.subtitle}
                        onChange={(e) =>
                          handleUpdateCategory(cat.id, cat.name, e.target.value)
                        }
                        className="w-full px-3 py-1.5 bg-white border border-[#005826]/30 rounded-lg text-xs font-semibold text-[#005826]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: CATERING PROMO SLIDE */}
        {activeTab === 'catering' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#005826]/15 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-[#005826] uppercase font-display">
                Рекламный слайд «Catering &amp; Partyservice»
              </h3>
              <p className="text-xs text-[#005826]/70 font-semibold">
                Изменения сохраняются автоматически в памяти приставки (localStorage) и не сбрасываются после перезагрузки.
                Чтобы сохранить их в файл на GitHub, нажмите «Опубликовать».
              </p>

              <label className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-300 rounded-xl text-sm font-bold text-[#005826] cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-[#005826]"
                  checked={config.cateringEnabled !== false}
                  onChange={(e) => updateConfigField('cateringEnabled', e.target.checked)}
                />
                Включить показ слайда кейтеринга
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005826] uppercase mb-1">
                    Время показа (сек)
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={120}
                    value={config.cateringDuration ?? 15}
                    onChange={(e) => updateConfigField('cateringDuration', Math.max(3, Number(e.target.value) || 15))}
                    className="w-full px-3 py-2 bg-gray-50 border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005826] uppercase mb-1">
                    Показывать после N блюд
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={config.showEveryNDishes ?? 3}
                    onChange={(e) => updateConfigField('showEveryNDishes', Math.max(1, Number(e.target.value) || 3))}
                    className="w-full px-3 py-2 bg-gray-50 border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-[#005826] uppercase mb-1">
                  Заголовок (немецкий)
                </label>
                <input
                  type="text"
                  value={config.cateringTitle ?? DEFAULT_CATERING_TITLE}
                  onChange={(e) => updateConfigField('cateringTitle', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826]"
                />
                <p className="text-[11px] text-[#005826]/60 mt-1">Часть после «&amp;» выделяется оранжевым цветом.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#005826] uppercase mb-1">
                  Подзаголовок / описание (немецкий)
                </label>
                <textarea
                  rows={3}
                  value={config.cateringSubtitle ?? DEFAULT_CATERING_SUBTITLE}
                  onChange={(e) => updateConfigField('cateringSubtitle', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#005826] uppercase mb-1">
                  Телефон (необязательно)
                </label>
                <input
                  type="text"
                  value={config.cateringPhone ?? ''}
                  onChange={(e) => updateConfigField('cateringPhone', e.target.value)}
                  placeholder="Пусто — телефон не показывается"
                  className="w-full px-3 py-2 bg-gray-50 border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS (GitHub & PIN) */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#005826]/15 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-[#005826] uppercase font-display flex items-center gap-2">
                <Lock size={18} />
                <span>Настройки GitHub API и PIN-кода</span>
              </h3>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#005826] uppercase mb-1">
                    PIN-код администратора
                  </label>
                  <input
                    type="text"
                    value={settingsPin}
                    onChange={(e) => setSettingsPin(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-[#005826]/30 rounded-xl font-mono text-sm font-bold text-[#005826]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#005826] uppercase mb-1">
                    Репозиторий GitHub (owner/repo)
                  </label>
                  <input
                    type="text"
                    value={settingsRepo}
                    onChange={(e) => setSettingsRepo(e.target.value)}
                    placeholder="Например: username/tv-banner"
                    className="w-full px-3 py-2 bg-gray-50 border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#005826] uppercase mb-1">
                    Персональный токен GitHub (PAT)
                  </label>
                  <input
                    type="password"
                    value={settingsToken}
                    onChange={(e) => setSettingsToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 bg-gray-50 border border-[#005826]/30 rounded-xl font-mono text-sm text-[#005826]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#005826] uppercase mb-1">
                    Ветка (Branch, по умолчанию: main)
                  </label>
                  <input
                    type="text"
                    value={settingsBranch}
                    onChange={(e) => setSettingsBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826]"
                  />
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-xs font-bold text-[#005826] uppercase mb-1">
                    Слоган на экране ТВ (немецкий)
                  </label>
                  <input
                    type="text"
                    value={config.slogan}
                    onChange={(e) => {
                      const nextConfig = { ...config, slogan: e.target.value };
                      setConfig(nextConfig);
                      setHasUnsavedChanges(true);
                      syncAndPersist(items, categories, nextConfig);
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#005826] uppercase mb-1">
                    Wi-Fi / Инфо-текст в шапке ТВ
                  </label>
                  <input
                    type="text"
                    value={config.phoneOrWifi || ''}
                    onChange={(e) => {
                      const nextConfig = { ...config, phoneOrWifi: e.target.value };
                      setConfig(nextConfig);
                      setHasUnsavedChanges(true);
                      syncAndPersist(items, categories, nextConfig);
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826]"
                  />
                </div>

                {settingsMsg && (
                  <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold">
                    {settingsMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#005826] text-[#F4C414] hover:bg-[#00421C] rounded-xl font-black text-xs uppercase tracking-wider shadow-md"
                >
                  Сохранить настройки GitHub
                </button>

                <div className="pt-4 border-t-2 border-red-200">
                  <h4 className="text-xs font-black uppercase text-red-700 mb-1">
                    Сброс данных
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Если необходимо удалить все локально добавленные блюда и вернуть заводское меню (1 блюдо).
                  </p>
                  <button
                    type="button"
                    onClick={handleResetToFactoryDefaults}
                    className="w-full py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-300 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Сбросить всё меню к исходному состоянию
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Dish Editor Modal */}
      {editingDish !== undefined && (
        <DishEditorModal
          initialDish={editingDish}
          categories={categories}
          currentDishCount={items.length}
          onSave={handleSaveDishFromModal}
          onCancel={() => setEditingDish(undefined)}
        />
      )}

    </div>
  );
};
