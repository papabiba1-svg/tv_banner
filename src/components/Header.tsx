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
      <div className="h-[1vh] min-h-[8px] w-full mta-stripes shadow-md relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
      </div>

      {/* 2. Main Minimalist Premium Full-Width Header Bar */}
      <div className="bg-[#F9F6E8]/90 backdrop-blur-md border-b-2 border-[#005826]/15 px-[3.5vw] py-[1.5vh] flex items-center justify-between shadow-sm relative">
        
        {/* Left: Brand Logo + Restaurant Name */}
        <div className="flex items-center gap-[1.5vw]">
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
                  className="w-[7.2vh] h-[7.2vh] min-w-[48px] min-h-[48px] rounded-full object-contain shadow-lg ring-2 ring-[#005826]/25 group-hover:ring-[#F4C414] transition-all bg-[#F9F6E8]"
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
            <h1 className="text-[clamp(1.4rem,2.6vw,3.4rem)] font-black tracking-tight text-[#005826] leading-none uppercase font-display drop-shadow-sm">
              {config.restaurantName || 'MTA FOOD HOUSE'}
            </h1>
            {/* Prominent, stylish "Frisch zubereitet" quality badge in the header */}
            <div className="flex items-center gap-[0.5vw] mt-[0.5vh]">
              <div className="inline-flex items-center gap-[0.4vw] bg-[#005826] text-[#F4C414] px-[1.1vw] py-[0.35vh] rounded-xl shadow-sm border border-[#F4C414]/40">
                <Sparkles className="w-[1.8vh] h-[1.8vh] min-w-[13px] min-h-[13px] fill-[#F4C414] text-[#F4C414]" />
                <span className="text-[clamp(0.95rem,1.35vw,1.8rem)] font-black tracking-widest uppercase font-display leading-tight">
                  Frisch zubereitet
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Elegant Date & Digital Clock Display */}
        <div className="flex items-center gap-[1vw] bg-white/85 backdrop-blur-md px-[1.5vw] py-[0.8vh] rounded-2xl border-2 border-[#005826]/15 shadow-sm">
          {dateStr && (
            <div className="flex items-center gap-[0.5vw] border-r-2 border-[#005826]/15 pr-[1vw]">
              <Calendar className="w-[2.2vh] h-[2.2vh] min-w-[16px] min-h-[16px] text-[#005826]" />
              <span className="font-mono text-[clamp(1rem,1.4vw,1.9rem)] font-extrabold text-[#005826] tracking-wide leading-none">
                {dateStr}
              </span>
            </div>
          )}
          <div className="flex items-center gap-[0.5vw]">
            <Clock className="w-[2.4vh] h-[2.4vh] min-w-[18px] min-h-[18px] text-[#F4C414]" />
            <span className="font-mono text-[clamp(1.1rem,1.9vw,2.5rem)] font-black text-[#005826] tracking-widest leading-none">
              {time || '--:--:--'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
