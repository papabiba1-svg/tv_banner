import React from 'react';
import { motion } from 'framer-motion';
import {
  resolveAssetUrl,
  DEFAULT_CATERING_TITLE,
  DEFAULT_CATERING_SUBTITLE,
} from '../data/menuData';
import type { MenuBoardConfig } from '../data/menuData';

const HERO_IMAGE = '/images/catering/generated-2026-10/grillplatte-oriental.png';
const HERO_LABEL = 'Grillplatte Oriental';

const BENEFITS = ['🔥 Holzkohlegrill', '✨ Frisch zubereitet', '📋 Individuell'];

interface CateringPromoSlideProps {
  config: MenuBoardConfig;
}

/** Splits the title at "&" so the second part can be highlighted in amber. */
const renderTitle = (title: string) => {
  const idx = title.indexOf('&');
  if (idx <= 0) return title;
  return (
    <>
      {title.slice(0, idx).trim()}{' '}
      <span className="text-[#f59e0b]">{title.slice(idx).trim()}</span>
    </>
  );
};

export const CateringPromoSlide: React.FC<CateringPromoSlideProps> = ({ config }) => {
  const title = config.cateringTitle?.trim() || DEFAULT_CATERING_TITLE;
  const subtitle = config.cateringSubtitle?.trim() || DEFAULT_CATERING_SUBTITLE;
  const phone = config.cateringPhone?.trim() || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex overflow-hidden relative z-10 px-[3vw] py-[2.5vh] gap-[3vw]"
    >
      {/* LEFT: large, high-contrast promo typography */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-[50%] flex-shrink-0 h-full min-h-0 flex flex-col justify-center gap-[2.4vh] overflow-hidden"
      >
        <div className="self-start px-[1.6vw] py-[1vh] rounded-full bg-[#f59e0b] text-[#1a1203] font-black tracking-[0.1em] uppercase text-[3.8vh] leading-none shadow-[0_6px_24px_rgba(245,158,11,0.35)] whitespace-nowrap">
          Catering &amp; Partyservice
        </div>

        <h2 className="text-[7vh] font-black font-display leading-[1.05] text-[#FDFBF7] drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]">
          {renderTitle(title)}
        </h2>

        <p className="text-[4.2vh] font-bold leading-[1.28] text-[#F4F1EA] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] pl-[1.4vw] border-l-[6px] border-[#f59e0b]">
          {subtitle}
        </p>

        <div className="flex flex-wrap gap-[1.4vh]">
          {BENEFITS.map((b) => (
            <div
              key={b}
              className="px-[1.3vw] py-[1.2vh] rounded-2xl bg-white/[0.1] border-2 border-[#f59e0b]/40 text-[3.6vh] leading-none font-extrabold text-[#FDFBF7] whitespace-nowrap shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
            >
              {b}
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-[#005826] to-[#00421C] border-2 border-[#f59e0b]/70 px-[1.6vw] py-[1.8vh] shadow-[0_8px_28px_rgba(0,0,0,0.45)]">
          <div className="text-[3vh] leading-none font-black tracking-[0.1em] uppercase text-[#f59e0b] whitespace-nowrap">
            Jetzt vorbestellen{phone ? `: ${phone}` : ''}
          </div>
          <div className="text-[4.2vh] leading-[1.15] font-black font-display text-[#FDFBF7] mt-[1vh]">
            Sprechen Sie unser Personal an!
          </div>
        </div>
      </motion.div>

      {/* RIGHT: one large premium hero photo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 min-w-0 h-full relative overflow-hidden rounded-[2.5vh] border-2 border-[#f59e0b]/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-[#07120B]"
      >
        <motion.img
          src={resolveAssetUrl(HERO_IMAGE)}
          alt={HERO_LABEL}
          initial={{ scale: 1.02 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 16, ease: 'linear' }}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-x-0 bottom-0 px-[2vw] pt-[8vh] pb-[2.5vh] bg-gradient-to-t from-black/85 via-black/50 to-transparent">
          <span className="text-[4.6vh] font-black font-display text-[#FDFBF7] leading-none drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]">
            {HERO_LABEL}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
