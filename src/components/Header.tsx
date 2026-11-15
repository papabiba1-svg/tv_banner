import React, { useState, useEffect, useRef } from 'react';
import { Clock, Maximize2, Minimize2, ShieldCheck } from 'lucide-react';
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
      <div className="h-2.5 w-full mta-stripes shadow-md relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
      </div>

      {/* 2. Main Minimalist Premium Header Bar */}
      <div className="bg-[#F9F6E8]/90 backdrop-blur-md border-b border-[#005826]/15 px-8 md:px-14 py-4 flex items-center justify-between shadow-sm relative">
        
        {/* Left: Brand Logo + Restaurant Name */}
        <div className="flex items-center gap-4 md:gap-5">
          <div className="relative group">
            <button
              onClick={handleLogoClick}
              title="Vollbildmodus (3x klicken für Admin-Bereich)"
              className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
            >
              <div className="relative">
                <img
                  src={resolveAssetUrl(config.logoUrl || './logo.png')}
                  alt="MTA Food House"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-contain shadow-lg ring-2 ring-[#005826]/20 group-hover:ring-[#F4C414] transition-all bg-[#F9F6E8]"
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

          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-[#005826] leading-none uppercase font-display drop-shadow-sm">
              {config.restaurantName || 'MTA FOOD HOUSE'}
            </h1>
          </div>
        </div>

        {/* Right: Elegant Digital Clock Only */}
        <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-md px-5 py-2 rounded-2xl border border-[#005826]/15 shadow-sm">
          <Clock size={20} className="text-[#F4C414]" />
          <span className="font-mono text-xl md:text-2xl lg:text-3xl font-black text-[#005826] tracking-widest leading-none">
            {time || '--:--:--'}
          </span>
        </div>
      </div>
    </header>
  );
};
