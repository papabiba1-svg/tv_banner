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
    <div className="relative w-full h-full flex flex-col justify-between px-[3.5vw] py-[1.8vh] overflow-hidden">
      
      {/* Full-screen ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[55%] left-[24%] -translate-x-1/2 -translate-y-1/2 w-[44vw] h-[44vw] rounded-full bg-gradient-to-tr from-[#F4C414]/25 via-[#005826]/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-8%] right-[6%] w-[36vw] h-[36vw] rounded-full bg-gradient-to-tl from-[#005826]/10 via-[#F4C414]/15 to-transparent blur-3xl" />
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
          {/* TOP ROW: Strictly Centered Single-Line Dish Title right below Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-shrink-0 flex flex-col items-center justify-center text-center pt-[0.4vh] pb-[1.2vh]"
          >
            <h2
              style={{ whiteSpace: 'nowrap' }}
              className="w-full text-center whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(2.2rem,4.7vw,6.2rem)] font-black text-[#005826] font-display tracking-tight leading-[1.08] drop-shadow-sm px-[1vw]"
            >
              {dish.name}
            </h2>
            {/* Centered Gold & Green Signature Accent Line */}
            <div className="w-[16vw] h-[0.7vh] min-h-[5px] bg-gradient-to-r from-transparent via-[#F4C414] to-transparent rounded-full mt-[1vh] shadow-sm" />
          </motion.div>

          {/* MAIN CONTENT ROW: Two-Column Split Below Centered Title */}
          <div className="flex-1 min-h-0 w-full grid grid-cols-12 items-center gap-[3vw] overflow-hidden">
            
            {/* LEFT COLUMN (Cols 1..6): Large Juicy Plate Photo with Floating Animation */}
            <div className="col-span-6 h-full flex flex-col items-center justify-center relative">
              
              {/* Decorative Culinary Halo Ring behind the plate */}
              <div className="absolute w-[33vw] h-[33vw] max-w-[60vh] max-h-[60vh] rounded-full border-2 border-[#005826]/10 bg-gradient-to-br from-white/65 via-white/25 to-transparent shadow-[0_25px_70px_rgba(0,88,38,0.07)] pointer-events-none" />

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
                className="relative flex items-center justify-center w-full h-full"
              >
                {/* Gentle swaying and levitation floating animation */}
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
                  {/* Large Hero Dish Image */}
                  <img
                    src={resolveAssetUrl(dish.image)}
                    alt={dish.name}
                    className="w-[41vw] h-[41vw] max-w-[66vh] max-h-[66vh] object-contain plate-drop-shadow filter select-none pointer-events-none"
                    loading="eager"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = resolveAssetUrl('./dishes/vareniki-s-mjasom-removebg-preview.png');
                    }}
                  />
                </motion.div>

                {/* Dynamic breathing shadow underneath plate */}
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
                  className="absolute bottom-[2.5vh] w-[26vw] max-w-[46vh] h-[3vh] bg-[#00421C]/30 rounded-[100%] blur-2xl pointer-events-none -z-10"
                />
              </motion.div>
            </div>

            {/* RIGHT COLUMN (Cols 7..12): Significantly Enlarged Description, Allergens & Massive Price Plate */}
            <div className="col-span-6 h-full flex flex-col justify-center text-left pr-[1vw] space-y-[2.6vh]">
              
              {/* 1. Composition & Ingredients Block (Significantly Enlarged Font for Hall Readability) */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-white/90 backdrop-blur-xl rounded-[2rem] px-[2.6vw] py-[2.8vh] border-l-[8px] border-[#005826] shadow-[0_22px_55px_-12px_rgba(0,40,15,0.14)] ring-1 ring-[#005826]/12"
              >
                <p className="text-[clamp(1.35rem,2.4vw,3.1rem)] text-[#1E2922] font-bold leading-[1.36]">
                  {dish.description}
                </p>
              </motion.div>

              {/* 2. Allergens Line (Significantly Enlarged Font & High-Contrast Pill) */}
              {dish.allergens && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-[1vw] self-start bg-[#005826]/10 border-2 border-[#005826]/25 px-[2vw] py-[1.3vh] rounded-2xl text-[clamp(1.1rem,1.85vw,2.35rem)] text-[#005826] font-extrabold shadow-sm"
                >
                  <Info className="w-[3vh] h-[3vh] min-w-[22px] min-h-[22px] text-[#005826] flex-shrink-0" />
                  <span>{dish.allergens}</span>
                </motion.div>
              )}

              {/* 3. Massive Eye-Catching Golden Price Plate + German Tax Note */}
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.38, type: 'spring', stiffness: 220, damping: 20 }}
                className="pt-[0.8vh] flex items-center gap-[2.4vw] flex-wrap"
              >
                {/* Massive Golden Price Badge with Intense Glow */}
                <div className="relative">
                  <div className="absolute -inset-3 bg-gradient-to-r from-[#F4C414] via-[#FFE066] to-[#F4C414] rounded-[2.2rem] blur-2xl opacity-75 animate-pulse pointer-events-none" />
                  <div className="relative bg-gradient-to-r from-[#F4C414] via-[#FFD738] to-[#F4C414] border-[4px] border-[#005826] rounded-[2rem] px-[3.6vw] py-[2.4vh] shadow-[0_18px_45px_rgba(244,196,20,0.55)] flex items-baseline">
                    <span className="text-[clamp(2.8rem,6.2vw,8rem)] font-black text-[#00421C] font-mono tracking-tight leading-none drop-shadow-sm">
                      {dish.priceFormatted}
                    </span>
                  </div>
                </div>

                {/* Enlarged German Tax & Freshness Seal */}
                <div className="flex flex-col text-left justify-center space-y-[0.4vh]">
                  <div className="flex items-center gap-[0.6vw] text-[#005826] font-black text-[clamp(1.15rem,1.8vw,2.3rem)] tracking-wide">
                    <Sparkles className="w-[2.8vh] h-[2.8vh] min-w-[20px] min-h-[20px] text-[#F4C414] fill-[#F4C414]" />
                    <span>Inkl. MwSt.</span>
                  </div>
                  <span className="text-[clamp(1rem,1.45vw,1.85rem)] text-[#005826]/85 font-extrabold">
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
