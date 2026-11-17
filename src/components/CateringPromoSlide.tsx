import React from 'react';
import { motion } from 'framer-motion';
import {
  resolveAssetUrl,
  DEFAULT_CATERING_TITLE,
  DEFAULT_CATERING_SUBTITLE,
} from '../data/menuData';
import type { MenuBoardConfig } from '../data/menuData';

const HERO_IMAGE = '/images/catering/generated-2026-10/grillplatte-oriental.png';

interface CateringPromoSlideProps {
  config: MenuBoardConfig;
}

/** Splits the title at "&" or "und" so "Exklusive Grillplatten" is strictly on line 1, and "& Fingerfood" starts line 2 */
const renderTitle = (title: string) => {
  const match = title.match(/\s+(&|und)\s+/i);
  if (match && match.index !== undefined) {
    const firstPart = title.slice(0, match.index).trim();
    const secondPart = title.slice(match.index).trim();
    return (
      <>
        <span className="block whitespace-nowrap">{firstPart}</span>
        <span className="block text-[#f59e0b] whitespace-nowrap">{secondPart}</span>
      </>
    );
  }
  return title;
};

const NO_WORD_BREAK_STYLE: React.CSSProperties = {
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',
  hyphens: 'none',
};

export const CateringPromoSlide: React.FC<CateringPromoSlideProps> = ({ config }) => {
  const title = config.cateringTitle?.trim() || DEFAULT_CATERING_TITLE;
  let subtitle = config.cateringSubtitle?.trim() || DEFAULT_CATERING_SUBTITLE;
  if (!subtitle || subtitle === 'Für Ihre Feiern, Firmen-Events und Familienfeste in Dorsten und Umgebung.') {
    subtitle = DEFAULT_CATERING_SUBTITLE;
  }
  const phone = config.cateringPhone?.trim() || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex overflow-hidden relative z-10 px-[3vw] py-[2vh] gap-[3vw]"
    >
      {/* LEFT: large, perfectly filled promo typography with staggered cascading entrance */}
      <div className="w-[50%] flex-shrink-0 h-full min-h-0 flex flex-col justify-between py-[0.8vh] overflow-hidden">
        
        {/* Step 2: Centered, enlarged orange badge (delay: 0.20s) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="self-center"
        >
          <div
            style={NO_WORD_BREAK_STYLE}
            className="px-[3.2vw] py-[1.5vh] rounded-full bg-[#f59e0b] text-[#1a1203] font-black tracking-[0.14em] uppercase text-[clamp(1.6rem,2.4vw,5.2vh)] leading-none shadow-[0_10px_35px_rgba(245,158,11,0.55)] whitespace-nowrap"
          >
            Catering &amp; Partyservice
          </div>
        </motion.div>

        {/* Step 3: Substantially enlarged main title (delay: 0.38s) */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={NO_WORD_BREAK_STYLE}
          className="text-[clamp(2.6rem,3.8vw,7.6vh)] font-black font-display leading-[1.06] text-[#FDFBF7] drop-shadow-[0_4px_20px_rgba(0,0,0,0.75)] text-left"
        >
          {renderTitle(title)}
        </motion.h2>

        {/* Step 4: Significantly enlarged delivery text (delay: 0.55s) */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={NO_WORD_BREAK_STYLE}
          className="text-[clamp(1.7rem,2.6vw,4.8vh)] font-bold leading-[1.3] text-[#F4F1EA] drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)] pl-[1.8vw] border-l-[8px] border-[#f59e0b]"
        >
          {subtitle}
        </motion.p>

        {/* Step 5: Badges stacked vertically in a column with enlarged size, icons, and padding (delay: 0.72s) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start gap-[1.2vh] w-full"
        >
          <div
            style={NO_WORD_BREAK_STYLE}
            className="px-[2.2vw] py-[1.4vh] rounded-2xl bg-white/[0.12] border-2 border-[#f59e0b]/60 text-[clamp(1.5rem,2.3vw,4.5vh)] leading-none font-black text-[#FDFBF7] whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex items-center gap-[0.9vw]"
          >
            <span className="text-[1.25em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">🔥</span>
            <span>Holzkohlegrill</span>
          </div>
          <div
            style={NO_WORD_BREAK_STYLE}
            className="px-[2.2vw] py-[1.4vh] rounded-2xl bg-white/[0.12] border-2 border-[#f59e0b]/60 text-[clamp(1.5rem,2.3vw,4.5vh)] leading-none font-black text-[#FDFBF7] whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex items-center gap-[0.9vw]"
          >
            <span className="text-[1.25em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">✨</span>
            <span>Frisch zubereitet</span>
          </div>
        </motion.div>

        {/* Step 6: Bottom order banner with exact original ideal sizing preserved (delay: 0.88s) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.88, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={NO_WORD_BREAK_STYLE}
          className="rounded-2xl bg-gradient-to-r from-[#005826] to-[#00421C] border-2 border-[#f59e0b]/80 px-[2.2vw] py-[2.2vh] shadow-[0_10px_32px_rgba(0,0,0,0.55)]"
        >
          <div className="text-[clamp(1.2rem,1.8vw,3.4vh)] leading-none font-black tracking-[0.14em] uppercase text-[#f59e0b] whitespace-nowrap">
            Jetzt vorbestellen{phone ? `: ${phone}` : ''}
          </div>
          <div className="text-[clamp(1.8rem,2.8vw,4.8vh)] leading-[1.12] font-black font-display text-[#FDFBF7] mt-[0.8vh]">
            Sprechen Sie unser Personal an!
          </div>
        </motion.div>
      </div>

      {/* Step 1: RIGHT - Pure, clean, premium hero photo appearing first (delay: 0.05s) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 min-w-0 h-full relative overflow-hidden rounded-[2.5vh] border-2 border-[#f59e0b]/35 shadow-[0_20px_60px_rgba(0,0,0,0.65)] bg-[#07120B]"
      >
        <motion.img
          src={resolveAssetUrl(HERO_IMAGE)}
          alt="Catering Grillplatte"
          initial={{ scale: 1.02 }}
          animate={{ scale: 1.09 }}
          transition={{ duration: 16, ease: 'linear' }}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          loading="eager"
        />
      </motion.div>
    </motion.div>
  );
};
