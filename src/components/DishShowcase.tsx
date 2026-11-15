import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Sparkles } from 'lucide-react';
import type { Dish } from '../data/menuData';
import { resolveAssetUrl } from '../data/menuData';

interface DishShowcaseProps {
  dish: Dish;
  direction: number; // 1 for next, -1 for prev
}

export const DishShowcase: React.FC<DishShowcaseProps> = ({ dish, direction }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between px-[3.5vw] py-[1.2vh] overflow-hidden">
      
      {/* Full-screen ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[55%] left-[24%] -translate-x-1/2 -translate-y-1/2 w-[44vw] h-[44vw] rounded-full bg-gradient-to-tr from-[#F4C414]/25 via-[#005826]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-8%] right-[6%] w-[36vw] h-[36vw] rounded-full bg-gradient-to-tl from-[#005826]/10 via-[#F4C414]/15 to-transparent blur-3xl pointer-events-none" />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={dish.id}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42 }}
          className="w-full h-full flex flex-col justify-between relative z-10 overflow-hidden"
        >
          {/* TOP ROW: Strictly Centered Single-Line Dish Title (High Z-Index, Never Overlapped) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-shrink-0 flex flex-col items-center justify-center text-center pt-[0.4vh] pb-[0.8vh] relative z-30"
          >
            <h2
              style={{ whiteSpace: 'nowrap' }}
              className="w-full text-center whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(2.2rem,4.4vw,5.2rem)] font-black text-[#005826] font-display tracking-tight leading-none drop-shadow-md px-[1vw]"
            >
              {dish.name}
            </h2>
            {/* Centered Gold & Green Accent Line */}
            <div className="w-[18vw] h-[0.6vh] min-h-[4px] bg-gradient-to-r from-transparent via-[#F4C414] to-transparent rounded-full mt-[1vh] shadow-sm" />
          </motion.div>

          {/* MAIN CONTENT ROW: Two-Column Split with clear separation from Title */}
          <div className="flex-1 min-h-0 w-full grid grid-cols-12 items-stretch gap-[3.5vw] overflow-hidden relative z-10 pt-[2.5vh] pb-[0.5vh]">
            
            {/* LEFT COLUMN (Cols 1..6): Large Food Plate Photo (strictly contained within viewport boundaries) */}
            <div className="col-span-6 h-full flex flex-col items-center justify-center relative z-10 overflow-hidden">
              
              {/* Decorative Culinary Halo Ring behind the plate */}
              <div className="absolute w-[37vw] h-[37vw] max-w-[55vh] max-h-[55vh] rounded-full border-2 border-[#005826]/10 bg-gradient-to-br from-white/65 via-white/25 to-transparent shadow-[0_20px_50px_rgba(0,88,38,0.07)] pointer-events-none -z-10" />

              {/* Plate Entrance Animation */}
              <motion.div
                initial={{
                  x: direction > 0 ? -70 : 70,
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  x: direction > 0 ? 70 : -70,
                  opacity: 0,
                  scale: 0.9,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 190,
                  damping: 24,
                  mass: 0.9,
                }}
                className="relative flex items-center justify-center w-full h-full -z-0"
              >
                {/* Gentle swaying and floating animation */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 1.2, 0, -1.2, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative flex items-center justify-center max-w-full max-h-full"
                >
                  {/* Large Food Plate Image (Enlarged while strictly respecting viewport and layout bounds) */}
                  <img
                    src={resolveAssetUrl(dish.image)}
                    alt={dish.name}
                    className="w-auto h-auto max-w-[42vw] max-h-[59vh] object-contain plate-drop-shadow filter select-none pointer-events-none"
                    loading="eager"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = resolveAssetUrl('./dishes/vareniki-s-mjasom-removebg-preview.png');
                    }}
                  />
                </motion.div>

                {/* Breathing shadow underneath plate */}
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
                  className="absolute bottom-[2vh] w-[30vw] max-w-[46vh] h-[2.5vh] bg-[#00421C]/25 rounded-[100%] blur-2xl pointer-events-none -z-10"
                />
              </motion.div>
            </div>

            {/* RIGHT COLUMN (Cols 7..12): Dynamic Height Description with Bottom-Anchored Price */}
            <div className="col-span-6 h-full flex flex-col text-left pr-[1vw] relative z-20 overflow-hidden">
              
              {/* 1. Composition & Ingredients Block (Adaptive dynamic height matching exact text size, clean spacing from title and allergens) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-auto max-h-[30vh] bg-white/92 backdrop-blur-xl rounded-[2.2rem] px-[2.6vw] py-[2vh] border-l-[10px] border-[#005826] shadow-[0_16px_36px_-10px_rgba(0,40,15,0.12)] ring-1 ring-[#005826]/12 overflow-hidden mb-[2.4vh] flex-shrink-0"
              >
                <p className="text-[clamp(1.3rem,2.1vw,2.8rem)] text-[#1E2922] font-black leading-[1.32] line-clamp-4 overflow-hidden text-ellipsis">
                  {dish.description}
                </p>
              </motion.div>

              {/* 2. Allergens Line (Consistent clean distance below description, with mb-auto to anchor price at bottom) */}
              <div className="h-[6.5vh] min-h-[44px] flex-shrink-0 flex items-center mb-auto overflow-hidden">
                {dish.allergens ? (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-[1vw] bg-[#005826]/10 border-[3px] border-[#005826]/25 px-[2vw] py-[0.9vh] rounded-2xl text-[clamp(1.15rem,1.8vw,2.4rem)] text-[#005826] font-black shadow-sm"
                  >
                    <Info className="w-[3.2vh] h-[3.2vh] min-w-[24px] min-h-[24px] text-[#005826] flex-shrink-0" />
                    <span className="truncate">{dish.allergens}</span>
                  </motion.div>
                ) : (
                  <div className="inline-flex items-center gap-[1vw] bg-[#005826]/5 border-[2px] border-[#005826]/15 px-[1.8vw] py-[0.8vh] rounded-2xl text-[clamp(1rem,1.5vw,2rem)] text-[#005826]/70 font-bold">
                    <Info className="w-[2.8vh] h-[2.8vh] min-w-[20px] min-h-[20px] text-[#005826]/60 flex-shrink-0" />
                    <span>Keine deklarationspflichtigen Allergene</span>
                  </div>
                )}
              </div>

              {/* 3. Massive Golden Price Plate with Soft Uniform Shadow (STRICTLY ANCHORED AT BOTTOM) */}
              <motion.div
                initial={{ opacity: 0, y: 22, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.32, type: 'spring', stiffness: 220, damping: 20 }}
                className="h-[14vh] min-h-[95px] flex-shrink-0 flex items-center gap-[2.6vw] overflow-visible pb-[0.5vh]"
              >
                {/* Massive Golden Price Badge with soft, uniform volumetric shadow */}
                <div className="relative flex-shrink-0">
                  <div
                    style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}
                    className="relative bg-gradient-to-r from-[#F4C414] via-[#FFD738] to-[#F4C414] border-[5px] border-[#005826] rounded-[2.4rem] px-[3.8vw] py-[1.8vh] flex items-baseline"
                  >
                    <span className="text-[clamp(3.2rem,6.8vw,8.5rem)] font-black text-[#00421C] font-mono tracking-tight leading-none drop-shadow-sm">
                      {dish.priceFormatted}
                    </span>
                  </div>
                </div>

                {/* Enlarged German Tax & Freshness Note */}
                <div className="flex flex-col text-left justify-center space-y-[0.4vh] flex-shrink-0">
                  <div className="flex items-center gap-[0.6vw] text-[#005826] font-black text-[clamp(1.25rem,1.9vw,2.5rem)] tracking-wide">
                    <Sparkles className="w-[3vh] h-[3vh] min-w-[22px] min-h-[22px] text-[#F4C414] fill-[#F4C414] flex-shrink-0" />
                    <span className="whitespace-nowrap">Inkl. MwSt.</span>
                  </div>
                  <span className="text-[clamp(1.05rem,1.5vw,2rem)] text-[#005826]/85 font-extrabold whitespace-nowrap">
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
