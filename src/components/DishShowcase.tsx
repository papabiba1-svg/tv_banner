import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import type { Dish } from '../data/menuData';
import { resolveAssetUrl } from '../data/menuData';

interface DishShowcaseProps {
  dish: Dish;
  direction: number; // 1 for next, -1 for prev
}

export const DishShowcase: React.FC<DishShowcaseProps> = ({ dish, direction }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-12 md:px-16 overflow-hidden">
      
      {/* Dynamic ambient backdrop glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[750px] h-[750px] rounded-full bg-gradient-to-tr from-[#F4C414]/15 via-[#005826]/8 to-transparent blur-3xl -translate-x-1/4 pointer-events-none" />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={dish.id}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full max-w-7xl grid grid-cols-2 items-center gap-12 lg:gap-16 relative z-10 py-4"
        >
          {/* LEFT: Animated Hero Dish Plate (50%) */}
          <div className="flex flex-col items-center justify-center relative">
            
            {/* Plate Entrance Animation */}
            <motion.div
              initial={{
                x: direction > 0 ? -100 : 100,
                opacity: 0,
                scale: 0.88,
              }}
              animate={{
                x: 0,
                opacity: 1,
                scale: 1,
              }}
              exit={{
                x: direction > 0 ? 100 : -100,
                opacity: 0,
                scale: 0.88,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 24,
                mass: 0.9,
              }}
              className="relative flex items-center justify-center"
            >
              {/* Gentle swaying and levitation floating animation */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 1.2, 0, -1.2, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative flex items-center justify-center"
              >
                {/* Food Plate PNG without background */}
                <img
                  src={resolveAssetUrl(dish.image)}
                  alt={dish.name}
                  className="w-[480px] h-[480px] lg:w-[520px] lg:h-[520px] max-h-[540px] object-contain plate-drop-shadow filter select-none pointer-events-none"
                  loading="eager"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = resolveAssetUrl('./dishes/vareniki-s-mjasom-removebg-preview.png');
                  }}
                />
              </motion.div>

              {/* Dynamic breathing shadow underneath plate */}
              <motion.div
                animate={{
                  scale: [1, 0.88, 1],
                  opacity: [0.38, 0.22, 0.38],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -bottom-8 w-4/5 h-10 bg-[#00421C]/25 rounded-[100%] blur-2xl pointer-events-none -z-10"
              />
            </motion.div>
          </div>

          {/* RIGHT: Cascading Glassmorphism Info & Price (50%) */}
          <div className="flex flex-col justify-center text-left">
            
            {/* Premium Multi-layer Card */}
            <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_25px_60px_-15px_rgba(0,40,15,0.14)] border border-white/80 ring-1 ring-[#005826]/10 flex flex-col space-y-6 max-w-2xl">
              
              {/* Top accent glow line */}
              <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-[#F4C414] to-transparent rounded-full opacity-80" />

              {/* 1. Large German Dish Title (Cascade 1) */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-[#005826] font-display tracking-tight leading-[1.08] drop-shadow-sm">
                  {dish.name}
                </h2>
              </motion.div>

              {/* 2. Composition & Ingredients Card (Cascade 2) */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#F9F6E8]/90 rounded-2xl p-5 border-l-4 border-[#005826] shadow-sm"
              >
                <p className="text-base sm:text-lg md:text-xl text-[#1E2922] font-medium leading-relaxed">
                  {dish.description}
                </p>
              </motion.div>

              {/* 3. Allergens (Cascade 3) */}
              {dish.allergens && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-[#005826]/80 font-bold"
                >
                  <Info size={16} className="text-[#005826] flex-shrink-0" />
                  <span>{dish.allergens}</span>
                </motion.div>
              )}

              {/* 4. Prominent Price Badge with "Inkl. MwSt." (Cascade 4) */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.48, type: 'spring', stiffness: 240, damping: 20 }}
                className="pt-2 flex items-center justify-between flex-wrap gap-4"
              >
                {/* Golden 3D Price Plate */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#F4C414] to-[#FFE066] rounded-2xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-[#F4C414] via-[#FFD738] to-[#F4C414] border-2 border-[#005826] rounded-2xl px-6 md:px-8 py-3 md:py-3.5 shadow-tv-badge flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-[#00421C] font-mono tracking-tight leading-none">
                      {dish.priceFormatted}
                    </span>
                  </div>
                </div>

                {/* German Tax & Freshness Note */}
                <div className="flex flex-col text-left font-bold text-[#005826]">
                  <span className="text-sm md:text-base font-black tracking-wide">
                    Inkl. MwSt.
                  </span>
                  <span className="text-xs md:text-sm text-[#005826]/75 font-semibold">
                    Frisch zubereitet
                  </span>
                </div>
              </motion.div>

            </div>

          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};
