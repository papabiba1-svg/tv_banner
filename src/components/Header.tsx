import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Maximize2, Minimize2, Wifi, ShieldCheck } from 'lucide-react';
import type { Category, MenuBoardConfig } from '../data/menuData';

interface HeaderProps {
  currentCategory: Category;
  config: MenuBoardConfig;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  dishCount: number;
  currentDishIndex: number;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  config,
  onToggleFullscreen,
  isFullscreen,
  dishCount,
  currentDishIndex,
  onOpenAdmin,
}) => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
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
      setDate(
        now.toLocaleDateString('de-DE', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
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
    <header className="relative w-full z-30 select-none">
      {/* 1. Signature MTA Food House Diagonal Stripes Ribbon */}
      <div className="h-3.5 w-full mta-stripes shadow-md relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
      </div>

      {/* 2. Main Header Bar */}
      <div className="bg-[#F9F6E8] border-b-2 border-[#005826]/15 px-8 py-3.5 flex items-center justify-between shadow-sm relative">
        
        {/* Left: Brand Logo + Interactive Fullscreen Trigger */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button
              onClick={handleLogoClick}
              title="Klicken für Vollbild (3x schnell klicken für Admin-Panel)"
              className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
            >
              <div className="relative">
                <img
                  src={config.logoUrl}
                  alt="MTA Food House Logo"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-contain shadow-lg ring-2 ring-[#005826]/20 group-hover:ring-[#F4C414] transition-all bg-[#F9F6E8]"
                />
                <span className="absolute -bottom-1 -right-1 bg-[#005826] text-[#F4C414] p-1 rounded-full text-xs shadow opacity-0 group-hover:opacity-100 transition-opacity">
                  {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                </span>
              </div>
            </button>

            {/* Hidden admin pill button on logo hover */}
            <button
              onClick={onOpenAdmin}
              title="Admin-Bereich öffnen"
              className="absolute -top-1 -right-2 bg-[#005826] text-[#F4C414] p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            >
              <ShieldCheck size={12} />
            </button>
          </div>

          <div className="hidden sm:block">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#005826] leading-none uppercase font-display">
              {config.restaurantName}
            </h1>
            <p className="text-xs md:text-sm font-semibold text-[#005826]/75 tracking-wider mt-0.5">
              {config.slogan}
            </p>
          </div>
        </div>

        {/* Center: Category Title (Prominent on TV screen) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none text-center max-w-[50%]">
          <motion.div
            key={currentCategory?.id || 'cat'}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-6 md:w-10 bg-[#F4C414]" />
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#005826] font-display drop-shadow-sm whitespace-nowrap">
                {currentCategory?.name || 'Menü'}
              </h2>
              <span className="h-0.5 w-6 md:w-10 bg-[#F4C414]" />
            </div>

            <p className="text-xs md:text-sm font-medium text-[#005826]/70 tracking-wide mt-0.5 truncate max-w-md hidden md:block">
              {currentCategory?.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Right: Digital Clock, TV Info & Indicators */}
        <div className="flex items-center gap-5">
          {/* Dish counter pill */}
          <div className="hidden lg:flex items-center bg-[#005826]/10 border border-[#005826]/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#005826]">
            <span className="text-[#005826] font-extrabold mr-1">
              Position {currentDishIndex + 1}
            </span>
            <span className="text-[#005826]/50">/ {dishCount}</span>
          </div>

          {/* Wi-Fi & Live Clock */}
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs text-[#005826]/80 font-semibold mb-0.5">
              <Wifi size={13} className="text-[#005826]" />
              <span className="hidden xl:inline">{config.phoneOrWifi}</span>
              <span className="xl:hidden">{date}</span>
            </div>
            <div className="flex items-center justify-end gap-1.5 font-mono text-lg md:text-2xl font-black text-[#005826] tracking-wider leading-none">
              <Clock size={16} className="text-[#F4C414] animate-pulse" />
              <span>{time || '--:--:--'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
