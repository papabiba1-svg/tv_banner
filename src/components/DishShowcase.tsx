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
    <div className="relative w-full h-full flex items-center justify-between px-[4vw] py-[2vh] overflow-hidden">
      
      {/* Full-screen ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-[24%] -translate-x-1/2 -translate-y-1/2 w-[46vw] h-[46vw] rounded-full bg-gradient-to-tr from-[#F4C414]/25 via-[#005826]/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-tl from-[#005826]/8 via-[#F4C414]/12 to-transparent blur-3xl" />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={dish.id}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full grid grid-cols-12 items-center gap-[3.5vw] relative z-10"
        >
          {/* LEFT HALF (50% of TV Screen): Large Juicy Hero Dish Photo with Floating Animation */}
          <div className="col-span-6 h-full flex flex-col items-center justify-center relative">
            
            {/* Decorative Culinary Halo Ring behind the plate */}
            <div className="absolute w-[36vw] h-[36vw] max-w-[68vh] max-h-[68vh] rounded-full border-2 border-[#005826]/10 bg-gradient-to-br from-white/65 via-white/25 to-transparent shadow-[0_25px_70px_rgba(0,88,38,0.07)] pointer-events-none" />

            {/* Plate Entrance Animation */}
            <motion.div
              initial={{
                x: direction > 0 ? -90 : 90,
                opacity: 0,
                scale: 0.88,
              }}
              animate={{
                x: 0,
                opacity: 1,
                scale: 1,
              }}
              exit={{
                x: direction > 0 ? 90 : -90,
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
                  y: [0, -16, 0],
                  rotate: [0, 1.5, 0, -1.5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative flex items-center justify-center"
              >
                {/* Hero Dish Image filling left half of screen */}
                <img
                  src={resolveAssetUrl(dish.image)}
                  alt={dish.name}
                  className="w-[43vw] h-[43vw] max-w-[74vh] max-h-[74vh] object-contain plate-drop-shadow filter select-none pointer-events-none"
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
                className="absolute bottom-[4vh] w-[28vw] max-w-[50vh] h-[3.5vh] bg-[#00421C]/30 rounded-[100%] blur-2xl pointer-events-none -z-10"
              />
            </motion.div>
          </div>

          {/* RIGHT HALF (50% of TV Screen): Full-Bleed High-Impact German Info & Glowing Gold Price */}
          <div className="col-span-6 h-full flex flex-col justify-center text-left pr-[1.5vw] space-y-[2.6vh]">
            
            {/* 1. Large German Dish Title */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <h2 className="text-[clamp(2rem,4.3vw,5.6rem)] font-black text-[#005826] font-display tracking-tight leading-[1.06] drop-shadow-sm">
                {dish.name}
              </h2>
              {/* Signature Gold & Green Accent Bar */}
              <div className="w-[9vw] h-[0.7vh] min-h-[5px] bg-gradient-to-r from-[#F4C414] via-[#FFD738] to-[#005826] rounded-full mt-[1.6vh] shadow-sm" />
            </motion.div>

            {/* 2. Composition & Ingredients Block (Large & Readable from across the hall) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-white/85 backdrop-blur-xl rounded-3xl px-[2.4vw] py-[2.5vh] border-l-[6px] border-[#005826] shadow-[0_20px_50px_-12px_rgba(0,40,15,0.12)] ring-1 ring-[#005826]/10"
            >
              <p className="text-[clamp(1.1rem,1.85vw,2.35rem)] text-[#1E2922] font-semibold leading-[1.42]">
                {dish.description}
              </p>
            </motion.div>

            {/* 3. Allergens Pill Badge */}
            {dish.allergens && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-[0.8vw] self-start bg-[#005826]/8 border border-[#005826]/20 px-[1.5vw] py-[1vh] rounded-2xl text-[clamp(0.85rem,1.25vw,1.55rem)] text-[#005826] font-bold shadow-sm"
              >
                <Info className="w-[2.2vh] h-[2.2vh] min-w-[16px] min-h-[16px] text-[#005826] flex-shrink-0" />
                <span>{dish.allergens}</span>
              </motion.div>
            )}

            {/* 4. Hero Price Badge in Golden-Yellow with Soft Glow + German Tax Note */}
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.44, type: 'spring', stiffness: 220, damping: 20 }}
              className="pt-[0.8vh] flex items-center gap-[2.2vw] flex-wrap"
            >
              {/* Golden Price Plate with Soft Ambient Glow */}
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#F4C414] via-[#FFE066] to-[#F4C414] rounded-3xl blur-xl opacity-70 animate-pulse pointer-events-none" />
                <div className="relative bg-gradient-to-r from-[#F4C414] via-[#FFD738] to-[#F4C414] border-[3px] border-[#005826] rounded-3xl px-[2.6vw] py-[1.8vh] shadow-[0_14px_35px_rgba(244,196,20,0.45)] flex items-baseline">
                  <span className="text-[clamp(2.2rem,4.6vw,6rem)] font-black text-[#00421C] font-mono tracking-tight leading-none drop-shadow-sm">
                    {dish.priceFormatted}
                  </span>
                </div>
              </div>

              {/* German Tax & Freshness Seal */}
              <div className="flex flex-col text-left justify-center">
                <div className="flex items-center gap-[0.5vw] text-[#005826] font-black text-[clamp(1rem,1.45vw,1.85rem)] tracking-wide">
                  <Sparkles className="w-[2.2vh] h-[2.2vh] min-w-[16px] min-h-[16px] text-[#F4C414] fill-[#F4C414]" />
                  <span>Inkl. MwSt.</span>
                </div>
                <span className="text-[clamp(0.85rem,1.2vw,1.5rem)] text-[#005826]/80 font-bold">
                  Frisch zubereitet
                </span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};
