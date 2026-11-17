import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import type { Dish } from '../data/menuData';
import { resolveAssetUrl } from '../data/menuData';

interface DishShowcaseProps {
  dish: Dish;
  direction: number; // 1 for next, -1 for prev
}

/**
 * Renders allergens with safe whole-unit wrapping so that individual allergen items
 * (e.g. "M (Senf)" or "G (Milch / Laktose)") never break across lines mid-word or mid-parenthesis.
 */
const renderAllergens = (allergensText?: string) => {
  if (!allergensText || !allergensText.trim()) {
    return (
      <span className="text-[#D6E4DB]">
        Keine deklarationspflichtigen Allergene
      </span>
    );
  }

  let prefix = '';
  let content = allergensText.trim();
  if (content.toLowerCase().startsWith('allergene:')) {
    prefix = 'Allergene:';
    content = content.slice(10).trim();
  }

  const items = content
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (items.length === 0) {
    return <span className="text-[#D6E4DB]">{allergensText}</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-[0.5vw] gap-y-[0.5vh] leading-[1.35] max-w-full">
      {prefix && (
        <span className="font-bold text-[#F4C414] whitespace-nowrap mr-[0.2vw]">
          {prefix}
        </span>
      )}
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span
            key={idx}
            className="whitespace-nowrap inline-flex items-center text-[#D6E4DB]"
          >
            {item}
            {!isLast && <span className="text-white/45 ml-[0.1vw] mr-[0.35vw]">,</span>}
          </span>
        );
      })}
    </div>
  );
};

export const DishShowcase: React.FC<DishShowcaseProps> = ({ dish, direction }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between px-[4vw] py-[1.4vh] overflow-hidden">
      
      {/* Cinematic Digital Signage ambient studio lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Warm golden-emerald studio key light behind the dish */}
        <div className="absolute top-[56%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[42vw] h-[42vw] max-w-[65vh] max-h-[65vh] rounded-full bg-gradient-to-tr from-[#007A35]/30 via-[#F4C414]/15 to-transparent blur-3xl pointer-events-none" />
        {/* Subtle atmospheric rim glow on the right */}
        <div className="absolute bottom-[5%] right-[12%] w-[32vw] h-[32vw] max-w-[50vh] max-h-[50vh] rounded-full bg-gradient-to-tl from-[#F4C414]/10 via-[#005826]/15 to-transparent blur-3xl pointer-events-none" />
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
          {/* TOP ROW: Centered Single-Line Dish Title with Signature Golden Underline */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-shrink-0 flex flex-col items-center justify-center text-center pt-[0.4vh] pb-[0.8vh] relative z-30"
          >
            <h2
              style={{ whiteSpace: 'nowrap' }}
              className="w-full text-center whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(2.6rem,5.2vw,6.4rem)] font-black text-[#FDFBF7] font-display tracking-tight leading-[1.08] drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)] px-[1vw]"
            >
              {dish.name}
            </h2>
            {/* Signature Golden Accent Line */}
            <div className="w-[26vw] h-[0.65vh] min-h-[4px] bg-gradient-to-r from-transparent via-[#F4C414] to-transparent rounded-full mt-[1vh] shadow-[0_2px_12px_rgba(244,196,20,0.45)]" />
          </motion.div>

          {/* MAIN CONTENT ROW: Two-Column Split strictly isolated within 100vh */}
          <div className="flex-1 min-h-0 w-full grid grid-cols-12 items-stretch gap-[3.5vw] overflow-hidden relative z-10 pt-[1.5vh] pb-[0.8vh]">
            
            {/* LEFT COLUMN (Cols 1..6): Cinematic Food Plate with Bottom Volumetric Backlight */}
            <div className="col-span-6 h-full flex flex-col items-center justify-center relative z-10 overflow-hidden">
              
              {/* Subtle Studio Rim Halo behind the plate */}
              <div className="absolute w-[36vw] h-[36vw] max-w-[54vh] max-h-[54vh] rounded-full border border-white/[0.07] bg-gradient-to-b from-white/[0.04] via-[#005826]/10 to-[#F4C414]/[0.08] shadow-[inset_0_0_50px_rgba(244,196,20,0.06)] pointer-events-none -z-10" />

              {/* Soft Volumetric Bottom Uplight / Pedestal Glow */}
              <div className="absolute bottom-[4vh] w-[34vw] max-w-[50vh] h-[18vh] rounded-full bg-gradient-to-t from-[#F4C414]/30 via-[#F4C414]/10 to-transparent blur-2xl pointer-events-none -z-10" />

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
                    rotate: [0, 1.1, 0, -1.1, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative flex items-center justify-center max-w-full max-h-full"
                >
                  {/* Large Food Plate Image */}
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

                {/* Warm Golden-Dark Floor Shadow & Glow Underneath Plate */}
                <motion.div
                  animate={{
                    scale: [1, 0.9, 1],
                    opacity: [0.65, 0.42, 0.65],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute bottom-[1.8vh] w-[30vw] max-w-[45vh] h-[3vh] bg-gradient-to-r from-transparent via-[#F4C414]/35 to-transparent rounded-[100%] blur-xl pointer-events-none -z-10"
                />
              </motion.div>
            </div>

            {/* RIGHT COLUMN (Cols 7..12): Frameless Digital Signage Typography & Bottom-Anchored Price */}
            <div className="col-span-6 h-full flex flex-col justify-between text-left px-[0.5vw] py-[1.5vh] relative z-20">
              
              {/* Top & Middle Info Group: Frameless Description + Sleek Allergens Line */}
              <div className="flex-1 min-h-0 flex flex-col justify-center">
                {/* 1. Dish Description (Frameless, airy, high-contrast typography directly on studio background) */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full pl-[2vw] border-l-[5px] border-[#F4C414] mb-[2.5vh]"
                >
                  <p className="text-[clamp(1.6rem,2.6vw,3.5rem)] text-[#F4F1EA] font-extrabold leading-[1.36] tracking-wide line-clamp-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                    {dish.description}
                  </p>
                </motion.div>

                {/* 2. Allergens Line (Strict, stylish Digital Signage badge with safe whole-unit wrapping) */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex items-center"
                >
                  <div className="w-fit max-w-full flex items-start gap-[0.8vw] bg-white/[0.06] border border-white/[0.14] backdrop-blur-md px-[1.6vw] py-[1vh] rounded-xl text-[clamp(1.1rem,1.65vw,2.2rem)] font-bold tracking-wide shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                    <Info className="w-[2.8vh] h-[2.8vh] min-w-[20px] min-h-[20px] text-[#F4C414] flex-shrink-0 mt-[0.2vh]" />
                    {renderAllergens(dish.allergens)}
                  </div>
                </motion.div>
              </div>

              {/* 3. Professional Frameless Digital Signage Price Display (Lifted higher & shifted right for breathing room) */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 220, damping: 22 }}
                className="flex-shrink-0 flex flex-col items-end justify-end self-end text-right pr-[1.2vw] pb-[2vh] mb-[1.5vh] relative"
              >
                {/* Subtle ambient studio glow behind the freestanding price numbers */}
                <div className="absolute -inset-x-[2.5vw] -inset-y-[1.5vh] bg-radial from-[#F4C414]/18 via-transparent to-transparent blur-2xl pointer-events-none -z-10" />

                {/* Giant Freestanding Cinematic Price Typography (No button borders or pill boxes) */}
                <div
                  style={{
                    filter:
                      'drop-shadow(0 14px 32px rgba(0, 0, 0, 0.85)) drop-shadow(0 2px 10px rgba(244, 196, 20, 0.28))',
                  }}
                  className="text-[clamp(4.8rem,9.2vw,12rem)] font-black font-display tracking-tight leading-[0.92] bg-gradient-to-b from-[#FFFDF0] via-[#FFDF00] to-[#E5A800] bg-clip-text text-transparent select-none whitespace-nowrap"
                >
                  {dish.priceFormatted}
                </div>

                {/* Harmoniously bound "Inkl. MwSt." sub-label directly beneath the price */}
                <div className="flex items-center justify-end gap-[0.6vw] mt-[0.8vh] pr-[0.3vw]">
                  <span className="w-[4vw] h-[2px] bg-gradient-to-r from-transparent to-[#F4C414]/75 rounded-full" />
                  <span className="text-[clamp(1.05rem,1.5vw,2rem)] font-bold uppercase tracking-[0.22em] text-[#E2ECE5]/85 whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                    Inkl. MwSt.
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
