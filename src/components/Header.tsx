import React, { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, Maximize2, Minimize2, ShieldCheck, Sparkles } from 'lucide-react';
import type { MenuBoardConfig } from '../data/menuData';
import { resolveAssetUrl } from '../data/menuData';

interface HeaderProps {
  config: MenuBoardConfig;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onToggleFullscreen,
  isFullscreen,
  onOpenAdmin,
}) => {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const clickCountRef = useRef<number>(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Triple-click on logo opens admin, single click toggles fullscreen
  const handleLogoClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenAdmin();
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1200);

    onToggleFullscreen();
  };

  return (
    <header className="relative w-full z-30 select-none flex-shrink-0">
      {/* 1. Signature MTA Diagonal Stripes Ribbon */}
      <div className="h-[0.8vh] min-h-[6px] w-full mta-stripes shadow-md relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />
      </div>

      {/* 2. Main Minimalist Premium Full-Width Digital Signage Header Bar */}
      <div className="bg-[#07120B]/80 backdrop-blur-xl border-b border-white/[0.08] px-[3.5vw] py-[1.2vh] flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.45)] relative">
        
        {/* Left: Brand Logo + Restaurant Name + "+ FRISCH ZUBEREITET" Badge */}
        <div className="flex items-center gap-[1.4vw]">
          <div className="relative group">
            <button
              onClick={handleLogoClick}
              title="Vollbildmodus (3x klicken für Admin-Bereich)"
              className="focus:outline-none transition-transform hover:scale-105 active:scale-95 block"
            >
              <div className="relative">
                <img
                  src={resolveAssetUrl(config.logoUrl || './logo.png')}
                  alt="MTA Food House"
                  className="w-[6.8vh] h-[6.8vh] min-w-[46px] min-h-[46px] rounded-full object-contain shadow-[0_4px_20px_rgba(0,0,0,0.6)] ring-2 ring-[#F4C414]/60 group-hover:ring-[#F4C414] transition-all bg-[#F9F6E8]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = resolveAssetUrl('./logo.png');
                  }}
                />
                <span className="absolute -bottom-1 -right-1 bg-[#005826] text-[#F4C414] p-1 rounded-full text-xs shadow opacity-0 group-hover:opacity-100 transition-opacity">
                  {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                </span>
              </div>
            </button>

            {/* Hidden admin pill button on logo hover */}
            <button
              onClick={onOpenAdmin}
              title="Панель администратора"
              className="absolute -top-1 -right-2 bg-[#005826] text-[#F4C414] p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            >
              <ShieldCheck size={12} />
            </button>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-[clamp(1.35rem,2.4vw,3.1rem)] font-black tracking-wider text-[#FDFBF7] leading-none uppercase font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {config.restaurantName || 'MTA FOOD HOUSE'}
            </h1>
            {/* Stylish "+ FRISCH ZUBEREITET" badge directly under restaurant name */}
            <div className="flex items-center mt-[0.5vh]">
              <div className="inline-flex items-center gap-[0.4vw] bg-gradient-to-r from-[#005826] to-[#00421C] text-[#F4C414] px-[1vw] py-[0.28vh] rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.35)] border border-[#F4C414]/45">
                <Sparkles className="w-[1.6vh] h-[1.6vh] min-w-[12px] min-h-[12px] fill-[#F4C414] text-[#F4C414]" />
                <span className="text-[clamp(0.85rem,1.2vw,1.55rem)] font-black tracking-[0.14em] uppercase font-display leading-tight">
                  + FRISCH ZUBEREITET
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Elegant Date & Digital Clock Display */}
        <div className="flex items-center gap-[1.1vw] bg-white/[0.06] backdrop-blur-md px-[1.5vw] py-[0.8vh] rounded-2xl border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          {dateStr && (
            <div className="flex items-center gap-[0.5vw] border-r border-white/[0.15] pr-[1.1vw]">
              <Calendar className="w-[2.1vh] h-[2.1vh] min-w-[16px] min-h-[16px] text-[#F4C414]" />
              <span className="font-mono text-[clamp(0.95rem,1.35vw,1.8rem)] font-bold text-[#E2ECE5] tracking-wider leading-none">
                {dateStr}
              </span>
            </div>
          )}
          <div className="flex items-center gap-[0.5vw]">
            <Clock className="w-[2.3vh] h-[2.3vh] min-w-[18px] min-h-[18px] text-[#F4C414]" />
            <span className="font-mono text-[clamp(1.1rem,1.8vw,2.35rem)] font-black text-[#FDFBF7] tracking-widest leading-none">
              {time || '--:--:--'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
