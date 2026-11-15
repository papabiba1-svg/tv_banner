import React from 'react';
import { motion } from 'framer-motion';
import type { Category, Dish } from '../data/menuData';

interface CategoryBarProps {
  categories: Category[];
  currentCategory: Category;
  dishesInCurrentCategory: Dish[];
  currentDishIndex: number;
  onSelectCategory: (category: Category) => void;
  onSelectDishIndex: (index: number) => void;
  progressPercent: number; // 0 to 100 for current slide countdown
  isPaused: boolean;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  currentCategory,
  dishesInCurrentCategory,
  currentDishIndex,
  onSelectCategory,
  onSelectDishIndex,
  progressPercent,
  isPaused,
}) => {
  return (
    <div className="relative w-full z-20 select-none">
      
      {/* 1. Countdown Progress Bar for TV Menu Slide */}
      <div className="w-full h-1.5 bg-[#005826]/15 overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-[#F4C414] via-[#FFE066] to-[#F4C414]"
          style={{ width: `${progressPercent}%` }}
          transition={{ ease: 'linear', duration: 0.1 }}
        />
        {isPaused && (
          <div className="absolute inset-0 bg-[#005826]/60 flex items-center justify-center text-[10px] text-white font-bold tracking-widest uppercase">
            Angehalten
          </div>
        )}
      </div>

      {/* 2. Bottom Navigation / Category Strip */}
      <div className="bg-[#F9F6E8]/95 backdrop-blur-md border-t-2 border-[#005826]/15 px-6 md:px-12 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Category Switchers */}
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto py-1">
          {categories.map((cat) => {
            const isActive = cat.id === currentCategory.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className={`relative px-4 py-2 rounded-xl font-bold text-xs md:text-sm tracking-wide transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#005826] text-[#F9F6E8] shadow-md scale-105'
                    : 'bg-[#005826]/8 hover:bg-[#005826]/15 text-[#005826]'
                }`}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#F4C414] animate-ping" />
                )}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Center: Slide Step Dots for current category */}
        <div className="flex items-center gap-2">
          {dishesInCurrentCategory.map((d, index) => {
            const isCurrent = index === currentDishIndex;
            return (
              <button
                key={d.id}
                onClick={() => onSelectDishIndex(index)}
                title={d.name}
                className="group p-1 focus:outline-none"
              >
                <div
                  className={`transition-all duration-300 rounded-full ${
                    isCurrent
                      ? 'w-7 md:w-9 h-2.5 md:h-3 bg-[#F4C414] ring-2 ring-[#005826]'
                      : 'w-2.5 md:w-3 h-2.5 md:h-3 bg-[#005826]/25 group-hover:bg-[#005826]/50'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right: Next Dish preview hint */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs text-[#005826]">
          <span className="font-bold opacity-75">Nächstes:</span>
          {dishesInCurrentCategory[(currentDishIndex + 1) % dishesInCurrentCategory.length] && (
            <span className="bg-[#FFFFFF] border border-[#005826]/20 px-3 py-1 rounded-lg font-semibold truncate max-w-[200px] shadow-sm">
              {dishesInCurrentCategory[(currentDishIndex + 1) % dishesInCurrentCategory.length].name}
            </span>
          )}
        </div>

      </div>

      {/* 3. Bottom Signature Diagonal Stripes Ribbon (slim) */}
      <div className="h-2 w-full mta-stripes-slim" />
    </div>
  );
};
