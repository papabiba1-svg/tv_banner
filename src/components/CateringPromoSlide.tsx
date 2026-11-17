import React from 'react';
import { motion } from 'framer-motion';
import {
  resolveAssetUrl,
  DEFAULT_CATERING_TITLE,
  DEFAULT_CATERING_SUBTITLE,
} from '../data/menuData';
import type { MenuBoardConfig } from '../data/menuData';

const HERO_IMAGE = '/images/catering/generated-2026-10/grillplatte-oriental.png';

const BENEFITS = ['🔥 Holzkohlegrill', '✨ Frisch zubereitet'];

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
      transition={{ duration: 0.5 }}
      className="w-full h-full flex overflow-hidden relative z-10 px-[3vw] py-[2vh] gap-[3vw]"
    >
      {/* LEFT: large, perfectly filled promo typography */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-[50%] flex-shrink-0 h-full min-h-0 flex flex-col justify-between py-[1vh] overflow-hidden"
      >
        {/* 1. Centered, prominent orange badge */}
        <div className="self-center px-[2.8vw] py-[1.4vh] rounded-full bg-[#f59e0b] text-[#1a1203] font-black tracking-[0.14em] uppercase text-[clamp(1.4rem,2.2vw,4.8vh)] leading-none shadow-[0_8px_30px_rgba(245,158,11,0.5)] whitespace-nowrap">
          Catering &amp; Partyservice
        </div>

        {/* 2. Main Title: "Exklusive Grillplatten" on row 1, "& Fingerfood" on row 2 */}
        <h2 className="text-[clamp(2.5rem,4vw,7.4vh)] font-black font-display leading-[1.06] text-[#FDFBF7] drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)] text-left">
          {renderTitle(title)}
        </h2>

        {/* 3. Delivery text with gold accent line */}
        <p className="text-[clamp(1.5rem,2.4vw,4.4vh)] font-bold leading-[1.32] text-[#F4F1EA] drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)] pl-[1.6vw] border-l-[7px] border-[#f59e0b]">
          {subtitle}
        </p>

        {/* 4. Two enlarged, prominent benefit badges spanning the width */}
        <div className="grid grid-cols-2 gap-[1.4vw] w-full">
          {BENEFITS.map((b) => (
            <div
              key={b}
              className="px-[1.6vw] py-[1.6vh] rounded-2xl bg-white/[0.12] border-2 border-[#f59e0b]/60 text-[clamp(1.4rem,2.1vw,4.2vh)] leading-none font-black text-[#FDFBF7] whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex items-center justify-center text-center"
            >
              {b}
            </div>
          ))}
        </div>

        {/* 5. Massive bottom order callout filling the lower area */}
        <div className="rounded-2xl bg-gradient-to-r from-[#005826] to-[#00421C] border-2 border-[#f59e0b]/80 px-[2.2vw] py-[2.2vh] shadow-[0_10px_32px_rgba(0,0,0,0.55)]">
          <div className="text-[clamp(1.2rem,1.8vw,3.4vh)] leading-none font-black tracking-[0.14em] uppercase text-[#f59e0b] whitespace-nowrap">
            Jetzt vorbestellen{phone ? `: ${phone}` : ''}
          </div>
          <div className="text-[clamp(1.8rem,2.8vw,4.8vh)] leading-[1.12] font-black font-display text-[#FDFBF7] mt-[0.8vh]">
            Sprechen Sie unser Personal an!
          </div>
        </div>
      </motion.div>

      {/* RIGHT: Pure, clean, premium hero photo without any overlay captions */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
