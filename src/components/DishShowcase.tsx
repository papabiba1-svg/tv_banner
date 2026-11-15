import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Leaf, Flame, Award, Info, Utensils } from 'lucide-react';
import type { Dish } from '../data/menuData';
import { resolveAssetUrl } from '../data/menuData';

interface DishShowcaseProps {
  dish: Dish;
  direction: number; // 1 for next, -1 for prev
}

export const DishShowcase: React.FC<DishShowcaseProps> = ({ dish, direction }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-between px-6 md:px-12 lg:px-16 overflow-hidden">
      
      {/* Dynamic ambient backdrop glow keyed to dish */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] rounded-full bg-gradient-to-tr from-[#F4C414]/15 via-[#005826]/10 to-transparent blur-3xl -translate-x-1/4" />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={dish.id}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full h-full grid grid-cols-12 items-center gap-6 lg:gap-12 relative z-10"
        >
          {/* Left Column: Animated Hero Plate with Levitation (cols 1..6) */}
          <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center relative py-4">
            
            {/* Entering motion wrapper */}
            <motion.div
              initial={{
                x: direction > 0 ? -120 : 120,
                opacity: 0,
                scale: 0.88,
                rotate: direction > 0 ? -6 : 6,
              }}
              animate={{
                x: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              exit={{
                x: direction > 0 ? 120 : -120,
                opacity: 0,
                scale: 0.88,
                rotate: direction > 0 ? 6 : -6,
              }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 24,
                mass: 0.9,
              }}
              className="relative flex items-center justify-center"
            >
              {/* Ongoing gentle floating / levitation animation */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 1.2, 0, -1.2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative"
              >
                {/* Plate PNG with transparent background */}
                <img
                  src={resolveAssetUrl(dish.image)}
                  alt={dish.name}
                  className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[460px] md:h-[460px] xl:w-[540px] xl:h-[540px] 2xl:w-[600px] 2xl:h-[600px] object-contain plate-drop-shadow filter select-none pointer-events-none"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to placeholder if custom image fails
                    const target = e.target as HTMLImageElement;
                    target.src = resolveAssetUrl('./dishes/wareniki-kartoffel.png');
                  }}
                />

                {/* Floating highlight badge on top of plate */}
                {dish.badge && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
                    className={`absolute -top-2 left-6 lg:left-10 px-4 py-1.5 rounded-full shadow-lg font-black text-xs md:text-sm uppercase tracking-wider flex items-center gap-1.5 border-2 ${
                      dish.badgeType === 'green'
                        ? 'bg-[#005826] text-[#F9F6E8] border-[#F4C414]'
                        : dish.badgeType === 'red'
                        ? 'bg-[#D32F2F] text-white border-white'
                        : 'bg-[#F4C414] text-[#005826] border-[#005826]'
                    }`}
                  >
                    {dish.badgeType === 'green' ? (
                      <Award size={15} />
                    ) : dish.isSpicy ? (
                      <Flame size={15} />
                    ) : (
                      <Sparkles size={15} />
                    )}
                    <span>{dish.badge}</span>
                  </motion.div>
                )}

                {/* Portion / Weight indicator tag */}
                {dish.portion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="absolute bottom-2 right-4 lg:right-8 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#005826]/20 px-3 py-1 rounded-full text-xs font-bold text-[#005826] shadow-md flex items-center gap-1.5"
                  >
                    <Utensils size={12} className="text-[#005826]" />
                    <span>{dish.portion}</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Dynamic ambient cast shadow below plate that scales with levitation */}
              <motion.div
                animate={{
                  scale: [1, 0.9, 1],
                  opacity: [0.45, 0.28, 0.45],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -bottom-6 w-3/4 h-8 bg-[#00421C]/25 rounded-[100%] blur-xl pointer-events-none -z-10"
              />
            </motion.div>
          </div>

          {/* Right Column: Dish Info, Allergens & Big Price Badge (cols 7..12) */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center text-left pl-0 lg:pl-4">
            
            {/* 1. Header Line: Order Number & Category Tags */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex items-center flex-wrap gap-2.5 mb-2.5"
            >
              <span className="bg-[#005826] text-[#F4C414] font-black text-sm md:text-base px-3.5 py-1 rounded-lg tracking-wider font-mono shadow-sm">
                Nr. {dish.orderNumber.replace('.', '')}
              </span>

              {dish.isVegetarian && (
                <span className="bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]/30 px-3 py-1 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1">
                  <Leaf size={14} />
                  Vegetarisch
                </span>
              )}

              {dish.isSpicy && (
                <span className="bg-[#FFEBEE] text-[#C62828] border border-[#C62828]/30 px-3 py-1 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1">
                  <Flame size={14} />
                  Leicht pikant
                </span>
              )}

              {dish.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#005826]/8 text-[#005826] px-2.5 py-1 rounded-lg text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* 2. Main Large Dish Title */}
            <motion.h2
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22, duration: 0.45 }}
              className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-[#005826] font-display tracking-tight leading-[1.08] mb-2 drop-shadow-sm"
            >
              {dish.name}
            </motion.h2>

            {/* 3. Subtitle / Tagline */}
            {dish.subtitle && (
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28, duration: 0.4 }}
                className="text-base md:text-xl font-bold text-[#D9AB07] tracking-wide mb-3"
              >
                {dish.subtitle}
              </motion.p>
            )}

            {/* 4. Rich Ingredients & Description */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="bg-[#FFFFFF]/85 backdrop-blur-sm border-l-4 border-[#005826] rounded-r-2xl p-4 md:p-5 shadow-sm mb-5 max-w-xl"
            >
              <p className="text-sm md:text-lg text-[#1E2922] font-medium leading-relaxed">
                {dish.description}
              </p>
            </motion.div>

            {/* 5. Allergens & Dietary Information Note */}
            {dish.allergens && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42 }}
                className="flex items-center gap-2 text-xs md:text-sm text-[#005826]/75 font-semibold mb-6"
              >
                <Info size={14} className="text-[#005826]" />
                <span>{dish.allergens}</span>
              </motion.div>
            )}

            {/* 6. Big Prominent Price Badge on Sunny Yellow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 280 }}
              className="flex items-center gap-5"
            >
              {/* Main Price Tag (Yellow MTA Badge) */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-[#F4C414] rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative bg-[#F4C414] border-3 border-[#005826] rounded-2xl px-6 md:px-8 py-2.5 md:py-3.5 shadow-tv-badge flex items-baseline gap-2">
                  <span className="text-xs md:text-sm font-black text-[#005826] uppercase tracking-wider">
                    Preis
                  </span>
                  <span className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-[#005826] font-mono tracking-tight leading-none">
                    {dish.priceFormatted}
                  </span>
                </div>
              </div>

              {/* Secondary badge: Tax included / Freshly prepared */}
              <div className="flex flex-col text-xs text-[#005826]/80 font-bold leading-tight">
                <span className="text-sm font-extrabold text-[#005826]">
                  Inkl. MwSt.
                </span>
                <span>Frisch zubereitet</span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};
