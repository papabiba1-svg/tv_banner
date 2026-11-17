import React from 'react';
import { motion } from 'framer-motion';
import { resolveAssetUrl } from '../data/menuData';

interface CollageCard {
  src: string;
  label: string;
  className: string;
  labelSize: string;
}

const IMG_BASE = '/images/catering/generated-2026-10/';

const CARDS: CollageCard[] = [
  {
    src: IMG_BASE + 'grillplatte-oriental.png',
    label: 'Grillplatte Oriental',
    className: 'col-span-2 row-span-3',
    labelSize: 'text-[clamp(1.3rem,2.1vw,2.8rem)]',
  },
  {
    src: IMG_BASE + 'tartelette-roter-kaviar.png',
    label: 'Tartelette mit rotem Kaviar',
    className: 'col-span-1 row-span-2',
    labelSize: 'text-[clamp(1rem,1.5vw,2rem)]',
  },
  {
    src: IMG_BASE + 'smoked-salmon-rolls.png',
    label: 'RĂ¤ucherlachs-RĂ¶llchen',
    className: 'col-span-1 row-span-2',
    labelSize: 'text-[clamp(1rem,1.5vw,2rem)]',
  },
  {
    src: IMG_BASE + 'gemischte-grillplatte.png',
    label: 'Gemischte Grillplatte',
    className: 'col-span-2 row-span-2',
    labelSize: 'text-[clamp(1.2rem,1.8vw,2.4rem)]',
  },
];

const BENEFITS = ['đź”Ą Holzkohlegrill', 'âś¨ Frisch zubereitet', 'đź“‹ Individuell'];

const PHONE = '01511 107 64 06';

export const CateringPromoSlide: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex overflow-hidden relative z-10 px-[3vw] py-[2vh] gap-[2.5vw]"
    >
      {/* LEFT (45vw): promo texts */}
      <div className="w-[45vw] max-w-[45%] h-full flex flex-col justify-center gap-[2.4vh] min-h-0">
        <div className="self-start px-[1.4vw] py-[0.8vh] rounded-full bg-[#f59e0b] text-[#1a1203] font-black tracking-[0.14em] uppercase text-[clamp(1rem,1.5vw,2rem)] shadow-[0_6px_20px_rgba(0,0,0,0.35)] whitespace-nowrap">
          CATERING &amp; PARTYSERVICE
        </div>

        <h2 className="text-[clamp(2.4rem,4.4vw,5.6rem)] font-black font-display leading-[1.06] text-[#FDFBF7] drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]">
          Exklusive Grillplatten <span className="text-[#f59e0b]">&amp; Fingerfood</span>
        </h2>

        <p className="text-[clamp(1.2rem,1.9vw,2.5rem)] font-bold leading-[1.35] text-[#F4F1EA] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] pl-[1.5vw] border-l-[5px] border-[#f59e0b]">
          FĂĽr Ihre Feiern, Firmen-Events und Familienfeste in Dorsten und Umgebung.
        </p>

        <div className="flex flex-wrap gap-[1vw]">
          {BENEFITS.map((b) => (
            <div
              key={b}
              className="px-[1.2vw] py-[1vh] rounded-xl bg-white/[0.08] border border-white/[0.16] text-[clamp(1rem,1.5vw,2rem)] font-extrabold text-[#FDFBF7] whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            >
              {b}
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-[#005826] to-[#00421C] border-2 border-[#f59e0b]/70 px-[1.8vw] py-[1.6vh] shadow-[0_8px_28px_rgba(0,0,0,0.45)]">
          <div className="text-[clamp(1rem,1.5vw,2rem)] font-black tracking-[0.12em] uppercase text-[#f59e0b]">
            JETZT VORBESTELLEN:
          </div>
          <div className="text-[clamp(1.9rem,3.3vw,4.4rem)] font-black font-display leading-[1.1] text-[#FDFBF7] whitespace-nowrap">
            {PHONE}
          </div>
          <div className="text-[clamp(1rem,1.5vw,2rem)] font-bold text-[#E2ECE5] mt-[0.4vh]">
            Sprechen Sie unser Personal an!
          </div>
        </div>
      </div>

      {/* RIGHT (55vw): collage */}
      <div className="flex-1 min-w-0 h-full grid grid-cols-2 grid-rows-7 gap-[1.2vw] min-h-0">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.src}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            className={`${c.className} relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12301d] to-[#07120B] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 min-h-0`}
          >
            <img
              src={resolveAssetUrl(c.src)}
              alt={c.label}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-x-0 bottom-0 px-[1vw] pt-[3vh] pb-[1vh] bg-gradient-to-t from-black/85 via-black/55 to-transparent">
              <span className={`${c.labelSize} font-black text-[#FDFBF7] leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]`}>
                {c.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
