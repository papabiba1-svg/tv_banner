import React from 'react';
import { motion } from 'framer-motion';
import type { Dish } from '../data/menuData';

interface CategoryPreviewListProps {
  dishes: Dish[];
  currentDishIndex: number;
  onSelectDish: (index: number) => void;
}

export const CategoryPreviewList: React.FC<CategoryPreviewListProps> = ({
  dishes,
  currentDishIndex,
  onSelectDish,
}) => {
  return (
    <div className="hidden 2xl:flex flex-col gap-2.5 w-72 pr-6 py-4 select-none z-20">
      <div className="flex items-center justify-between text-xs font-black text-[#005826] uppercase tracking-wider mb-1 px-1">
        <span>Menü-Übersicht</span>
        <span className="text-[#005826]/60 font-semibold">{dishes.length} Gerichte</span>
      </div>

      <div className="flex flex-col gap-2">
        {dishes.map((dish, index) => {
          const isActive = index === currentDishIndex;
          return (
            <motion.button
              key={dish.id}
              onClick={() => onSelectDish(index)}
              animate={{
                scale: isActive ? 1.02 : 1,
                x: isActive ? -4 : 0,
              }}
              transition={{ duration: 0.25 }}
              className={`flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-[#005826] text-[#F9F6E8] border-[#F4C414] shadow-lg ring-2 ring-[#F4C414]/50'
                  : 'bg-[#FFFFFF]/80 hover:bg-[#FFFFFF] text-[#005826] border-[#005826]/15 shadow-sm'
              }`}
            >
              {/* Dish Miniature */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#F4C414] rounded-full border border-[#005826]" />
                )}
              </div>

              {/* Title & Price */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-mono font-bold opacity-75">
                    {dish.orderNumber}
                  </span>
                  <span
                    className={`text-xs font-mono font-black px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#F4C414] text-[#005826]'
                        : 'bg-[#005826]/10 text-[#005826]'
                    }`}
                  >
                    {dish.priceFormatted}
                  </span>
                </div>
                <div
                  className={`text-sm font-bold truncate mt-0.5 ${
                    isActive ? 'text-white' : 'text-[#005826]'
                  }`}
                >
                  {dish.name}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
