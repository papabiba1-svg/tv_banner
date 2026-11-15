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
    <div className="relative w-full h-full flex flex-col justify-between px-[3.5vw] py-[1.5vh] overflow-hidden">
      
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
          transition={{ duration: 0.48 }}
          className="w-full h-full flex flex-col justify-between relative z-10 overflow-hidden"
        >
          {/* TOP ROW: Strictly Centered Single-Line Dish Title (High Z-Index, Never Overlapped) */}
          <motion.div
            initial={{ opacity: 0, y: -22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-shrink-0 flex flex-col items-center justify-center text-center pt-[0.2vh] pb-[1vh] relative z-30"
          >
            <h2
              style={{ whiteSpace: 'nowrap' }}
              className="w-full text-center whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(2.6rem,5.6vw,7.4rem)] font-black text-[#005826] font-display tracking-tight leading-[1.04] drop-shadow-md px-[1vw]"
            >
              {dish.name}
            </h2>
            {/* Centered Gold & Green Accent Line */}
            <div className="w-[18vw] h-[0.8vh] min-h-[6px] bg-gradient-to-r from-transparent via-[#F4C414] to-transparent rounded-full mt-[0.8vh] shadow-sm" />
          </motion.div>

          {/* MAIN CONTENT ROW: Two-Column Split strictly isolated from Top Title */}
          <div className="flex-1 min-h-0 w-full grid grid-cols-12 items-center gap-[3.5vw] overflow-hidden relative z-10">
            
            {/* LEFT COLUMN (Cols 1..6): Large Food Plate Photo on Back Layer (z-10, will not overlap title) */}
            <div className="col-span-6 h-full flex flex-col items-center justify-center relative z-10 overflow-hidden">
              
              {/* Decorative Culinary Halo Ring behind the plate */}
              <div className="absolute w-[36vw] h-[36vw] max-w-[66vh] max-h-[66vh] rounded-full border-2 border-[#005826]/10 bg-gradient-to-br from-white/65 via-white/25 to-transparent shadow-[0_25px_70px_rgba(0,88,38,0.07)] pointer-events-none -z-10" />

              {/* Plate Entrance Animation */}
              <motion.div
                initial={{
                  x: direction > 0 ? -80 : 80,
                  opacity: 0,
                  scale: 0.88,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  x: direction > 0 ? 80 : -80,
                  opacity: 0,
                  scale: 0.88,
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
                    y: [0, -14, 0],
                    rotate: [0, 1.4, 0, -1.4, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative flex items-center justify-center"
                >
                  {/* Large Food Plate Image */}
                  <img
                    src={resolveAssetUrl(dish.image)}
                    alt={dish.name}
                    className="w-[45vw] h-[45vw] max-w-[68vh] max-h-[68vh] object-contain plate-drop-shadow filter select-none pointer-events-none"
                    loading="eager"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = resolveAssetUrl('./dishes/vareniki-s-mjasom-removebg-preview.png');
                    }}
                  />
                </motion.div>

                {/* Breathing shadow underneath plate */}
                <motion.div
                  animate={{
                    scale: [1, 0.86, 1],
                    opacity: [0.4, 0.22, 0.4],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute bottom-[2vh] w-[28vw] max-w-[48vh] h-[3vh] bg-[#00421C]/30 rounded-[100%] blur-2xl pointer-events-none -z-10"
                />
              </motion.div>
            </div>

            {/* RIGHT COLUMN (Cols 7..12): Significantly Enlarged Description, Allergens & Massive Golden Price */}
            <div className="col-span-6 h-full flex flex-col justify-center text-left pr-[1vw] space-y-[2.8vh] relative z-20">
              
              {/* 1. Composition & Ingredients Block (Large High-Readability Font) */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-white/90 backdrop-blur-xl rounded-[2.2rem] px-[2.8vw] py-[2.8vh] border-l-[10px] border-[#005826] shadow-[0_24px_60px_-12px_rgba(0,40,15,0.15)] ring-1 ring-[#005826]/12"
              >
                <p className="text-[clamp(1.5rem,2.7vw,3.6rem)] text-[#1E2922] font-black leading-[1.32]">
                  {dish.description}
                </p>
              </motion.div>

              {/* 2. Allergens Line (Significantly Enlarged Font & Icon) */}
              {dish.allergens && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-[1.1vw] self-start bg-[#005826]/10 border-[3px] border-[#005826]/25 px-[2.2vw] py-[1.4vh] rounded-2xl text-[clamp(1.25rem,2.1vw,2.7rem)] text-[#005826] font-black shadow-sm"
                >
                  <Info className="w-[3.6vh] h-[3.6vh] min-w-[26px] min-h-[26px] text-[#005826] flex-shrink-0" />
                  <span>{dish.allergens}</span>
                </motion.div>
              )}

              {/* 3. Massive Golden Price Plate with Intense Ambient Glow */}
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.38, type: 'spring', stiffness: 220, damping: 20 }}
                className="pt-[1vh] flex items-center gap-[2.6vw] flex-wrap"
              >
                {/* Massive Golden Price Badge */}
                <div className="relative">
                  <div className="absolute -inset-3.5 bg-gradient-to-r from-[#F4C414] via-[#FFE066] to-[#F4C414] rounded-[2.6rem] blur-2xl opacity-80 animate-pulse pointer-events-none" />
                  <div className="relative bg-gradient-to-r from-[#F4C414] via-[#FFD738] to-[#F4C414] border-[5px] border-[#005826] rounded-[2.4rem] px-[4.2vw] py-[2.6vh] shadow-[0_20px_50px_rgba(244,196,20,0.6)] flex items-baseline">
                    <span className="text-[clamp(3.4rem,7.5vw,9.6rem)] font-black text-[#00421C] font-mono tracking-tight leading-none drop-shadow-md">
                      {dish.priceFormatted}
                    </span>
                  </div>
                </div>

                {/* Enlarged German Tax & Freshness Note */}
                <div className="flex flex-col text-left justify-center space-y-[0.5vh]">
                  <div className="flex items-center gap-[0.6vw] text-[#005826] font-black text-[clamp(1.3rem,2.1vw,2.7rem)] tracking-wide">
                    <Sparkles className="w-[3.2vh] h-[3.2vh] min-w-[24px] min-h-[24px] text-[#F4C414] fill-[#F4C414]" />
                    <span>Inkl. MwSt.</span>
                  </div>
                  <span className="text-[clamp(1.1rem,1.65vw,2.1rem)] text-[#005826]/85 font-extrabold">
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
