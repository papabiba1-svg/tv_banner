import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Leaf,
  Flame,
  Award,
  DollarSign,
  Utensils,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import type { Dish, Category } from '../../data/menuData';
import { formatEuroPrice } from '../../data/menuData';
import { compressImageForMenu } from '../../services/githubApi';

interface DishEditorModalProps {
  initialDish?: Dish | null; // null if adding new dish
  categories: Category[];
  currentDishCount: number;
  onSave: (dish: Dish, newImageFile?: { base64: string; filename: string }) => void;
  onCancel: () => void;
}

export const DishEditorModal: React.FC<DishEditorModalProps> = ({
  initialDish,
  categories,
  currentDishCount,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialDish);

  const [name, setName] = useState(initialDish?.name || '');
  const [subtitle, setSubtitle] = useState(initialDish?.subtitle || '');
  const [orderNumber, setOrderNumber] = useState(
    initialDish?.orderNumber || `${currentDishCount + 1}.`
  );
  const [categoryId, setCategoryId] = useState(
    initialDish?.categoryId || categories[0]?.id || ''
  );
  const [price, setPrice] = useState<number>(initialDish?.price || 9.9);
  const [description, setDescription] = useState(initialDish?.description || '');
  const [allergens, setAllergens] = useState(
    initialDish?.allergens || 'Allergene: A (Weizen), G (Milch)'
  );
  const [portion, setPortion] = useState(initialDish?.portion || '300g');
  const [badge, setBadge] = useState(initialDish?.badge || '');
  const [badgeType, setBadgeType] = useState<'yellow' | 'green' | 'red'>(
    initialDish?.badgeType || 'yellow'
  );
  const [isVegetarian, setIsVegetarian] = useState(
    initialDish?.isVegetarian || false
  );
  const [isSpicy, setIsSpicy] = useState(initialDish?.isSpicy || false);
  const [isBestseller, setIsBestseller] = useState(
    initialDish?.isBestseller || false
  );
  const [isAvailable, setIsAvailable] = useState<boolean>(
    initialDish?.isAvailable !== false
  );

  // Image state
  const [imagePreview, setImagePreview] = useState<string>(
    initialDish?.image || './dishes/wareniki-kartoffel.png'
  );
  const [compressedImage, setCompressedImage] = useState<{
    base64: string;
    filename: string;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setUploadError(null);
      const res = await compressImageForMenu(file, 800);
      setImagePreview(res.dataUrl);
      setCompressedImage({
        base64: res.base64,
        filename: res.filename,
      });
    } catch (err: any) {
      setUploadError(err.message || 'Ошибка сжатия изображения');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Build image path
    let imagePath = initialDish?.image || './dishes/wareniki-kartoffel.png';
    if (compressedImage) {
      imagePath = `./dishes/${compressedImage.filename}`;
    }

    const updatedDish: Dish = {
      id:
        initialDish?.id ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-') +
          '-' +
          Date.now().toString().slice(-4),
      orderNumber: orderNumber.trim().endsWith('.') ? orderNumber.trim() : `${orderNumber.trim()}.`,
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim(),
      price: Number(price),
      priceFormatted: formatEuroPrice(Number(price)),
      categoryId,
      image: imagePath,
      badge: badge.trim() || undefined,
      badgeType,
      allergens: allergens.trim() || undefined,
      portion: portion.trim() || undefined,
      isVegetarian,
      isSpicy,
      isBestseller,
      isAvailable,
      tags: initialDish?.tags || [isVegetarian ? 'Vegetarisch' : 'Hausgemacht'],
    };

    onSave(updatedDish, compressedImage || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-sm select-none overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#F9F6E8] border-2 border-[#005826] rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Ribbon Header */}
        <div className="h-2.5 w-full mta-stripes" />

        <div className="p-6 md:p-7 overflow-y-auto flex-1 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#005826]/15 pb-4">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-[#005826] uppercase font-display">
                {isEditing ? 'Редактировать блюдо' : 'Добавить новое блюдо'}
              </h3>
              <p className="text-xs text-[#005826]/70 font-semibold">
                Изменения отобразятся на телевизоре после нажатия «Сохранить и опубликовать»
              </p>
            </div>
            <button
              onClick={onCancel}
              title="Закрыть"
              className="text-[#005826]/60 hover:text-[#005826] font-black text-xl p-1"
            >
              ✕
            </button>
          </div>

          <form id="dish-editor-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Row 1: Image Upload & Preview + Basic info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              
              {/* Image Preview & Upload Box (cols 1..4) */}
              <div className="md:col-span-4 flex flex-col items-center">
                <label className="block text-xs font-black uppercase text-[#005826] mb-2 self-start">
                  Фото блюда (PNG на тарелке)
                </label>
                <div className="relative group w-44 h-44 rounded-2xl bg-white border-2 border-dashed border-[#005826]/30 hover:border-[#005826] flex flex-col items-center justify-center p-2 shadow-sm overflow-hidden transition-colors">
                  <img
                    src={imagePreview}
                    alt="Предпросмотр"
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = './dishes/wareniki-kartoffel.png';
                    }}
                  />
                  
                  {/* Upload overlay */}
                  <label className="absolute inset-0 bg-[#005826]/75 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity font-bold text-xs gap-1">
                    <Upload size={22} className="text-[#F4C414]" />
                    <span>Сменить фото</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <label className="mt-2 text-center text-[11px] font-bold text-[#005826] bg-white border border-[#005826]/20 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#005826]/5 transition-colors flex items-center gap-1.5">
                  <ImageIcon size={13} />
                  <span>Выбрать PNG / фото</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>

                {isCompressing && (
                  <span className="text-[10px] text-[#005826] font-semibold animate-pulse mt-1">
                    Сжатие изображения...
                  </span>
                )}
                {compressedImage && (
                  <span className="text-[10px] text-emerald-700 font-bold mt-1">
                    ✓ Изображение готово ({compressedImage.filename})
                  </span>
                )}
                {uploadError && (
                  <span className="text-[10px] text-rose-600 font-semibold mt-1">
                    {uploadError}
                  </span>
                )}
              </div>

              {/* Basic Fields (cols 5..12) */}
              <div className="md:col-span-8 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                      Номер
                    </label>
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="1."
                      className="w-full px-3 py-2 bg-white border border-[#005826]/30 rounded-xl font-mono font-bold text-[#005826] text-sm focus:ring-2 focus:ring-[#005826]"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                      Категория
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#005826]/30 rounded-xl font-bold text-[#005826] text-sm focus:ring-2 focus:ring-[#005826]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                    Название блюда (на немецком для гостей)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Например: Wareniki mit Kartoffel"
                    className="w-full px-3 py-2 bg-white border border-[#005826]/30 rounded-xl font-black text-base text-[#005826] focus:ring-2 focus:ring-[#005826]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                      Цена в €
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 text-[#005826]/50" size={16} />
                      <input
                        type="number"
                        step="0.10"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-[#005826]/30 rounded-xl font-mono font-black text-[#005826] text-base focus:ring-2 focus:ring-[#005826]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                      Порция / вес
                    </label>
                    <div className="relative">
                      <Utensils className="absolute left-3 top-2.5 text-[#005826]/50" size={16} />
                      <input
                        type="text"
                        value={portion}
                        onChange={(e) => setPortion(e.target.value)}
                        placeholder="Например: 10 Stk. • 320g"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826] focus:ring-2 focus:ring-[#005826]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                    Подзаголовок / слоган (на немецком)
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Например: Der beliebte Klassiker nach Hausrezept"
                    className="w-full px-3 py-2 bg-white border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826] focus:ring-2 focus:ring-[#005826]"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Description & Ingredients */}
            <div>
              <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                Состав и описание (на немецком для ТВ)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Zarte Teigtaschen gefüllt mit samtigem Kartoffelpüree..."
                className="w-full px-3 py-2 bg-white border border-[#005826]/30 rounded-xl text-sm font-medium text-[#1E2922] focus:ring-2 focus:ring-[#005826]"
                required
              />
            </div>

            {/* Row 3: Allergens */}
            <div>
              <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                Аллергены и примечания (на немецком)
              </label>
              <input
                type="text"
                value={allergens}
                onChange={(e) => setAllergens(e.target.value)}
                placeholder="Allergene: A (Weizen), G (Milch / Laktose)"
                className="w-full px-3 py-2 bg-white border border-[#005826]/30 rounded-xl text-xs font-semibold text-[#005826] focus:ring-2 focus:ring-[#005826]"
              />
            </div>

            {/* Row 4: Badges & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/70 p-3.5 rounded-2xl border border-[#005826]/15">
              <div>
                <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                  Плашка-выделение (бейдж на фото)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Например: Bestseller, Chef-Tipp"
                    className="flex-1 px-3 py-1.5 bg-white border border-[#005826]/30 rounded-xl text-xs font-bold text-[#005826]"
                  />
                  <select
                    value={badgeType}
                    onChange={(e: any) => setBadgeType(e.target.value)}
                    className="px-2 py-1.5 bg-white border border-[#005826]/30 rounded-xl text-xs font-bold text-[#005826]"
                  >
                    <option value="yellow">Жёлтый</option>
                    <option value="green">Зелёный</option>
                    <option value="red">Красный</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVegetarian(!isVegetarian)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    isVegetarian
                      ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Leaf size={14} />
                  <span>Вегетарианское</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSpicy(!isSpicy)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    isSpicy
                      ? 'bg-[#FFEBEE] text-[#C62828] border border-[#C62828]'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Flame size={14} />
                  <span>Острое / Пикантное</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBestseller(!isBestseller)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    isBestseller
                      ? 'bg-[#F4C414] text-[#005826] border border-[#005826]'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Award size={14} />
                  <span>Топ продаж</span>
                </button>
              </div>
            </div>

            {/* Row 5: Availability Switch (В наличии / Скрыто) */}
            <div className="flex items-center justify-between p-3.5 bg-[#FFFFFF] rounded-2xl border border-[#005826]/20">
              <div>
                <div className="text-xs font-black uppercase text-[#005826]">
                  Статус отображения на телевизоре
                </div>
                <div className="text-[11px] text-[#005826]/70 font-semibold">
                  {isAvailable
                    ? 'В наличии: показывается в меню на экране ТВ'
                    : 'Скрыто: блюдо закончилось или временно недоступно'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  isAvailable
                    ? 'bg-[#005826] text-[#F4C414] shadow-sm'
                    : 'bg-rose-100 text-rose-700 border border-rose-300'
                }`}
              >
                {isAvailable ? <Check size={14} /> : null}
                <span>{isAvailable ? 'В наличии (на ТВ)' : 'Скрыто из меню'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-5 bg-[#FFFFFF] border-t border-[#005826]/15 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#005826] rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            form="dish-editor-form"
            className="px-6 py-2.5 bg-[#005826] hover:bg-[#00421C] text-[#F4C414] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <Check size={16} />
            <span>{isEditing ? 'Сохранить изменения' : 'Добавить блюдо'}</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
};
