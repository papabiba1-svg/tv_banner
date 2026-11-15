import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Settings,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

interface KioskControlsProps {
  isPaused: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  slideDuration: number;
  onChangeDuration: (seconds: number) => void;
  onOpenAdmin: () => void;
}

export const KioskControls: React.FC<KioskControlsProps> = ({
  isPaused,
  onTogglePlay,
  onPrev,
  onNext,
  isFullscreen,
  onToggleFullscreen,
  slideDuration,
  onChangeDuration,
  onOpenAdmin,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Auto-hide controls after 3.5 seconds of mouse inactivity
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handleMouseMove = () => {
      setIsVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsVisible(false);
        setShowSettings(false);
      }, 3500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed bottom-16 right-6 z-40">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 bg-[#002E13]/90 text-white backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-[#F4C414]/30"
          >
            {/* Prev button */}
            <button
              onClick={onPrev}
              title="Vorheriges Gericht"
              className="p-2 hover:bg-[#005826] rounded-xl transition-colors text-white"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Play/Pause button */}
            <button
              onClick={onTogglePlay}
              title={isPaused ? 'Fortsetzen' : 'Pausieren'}
              className="p-2 bg-[#F4C414] text-[#00421C] hover:bg-[#FFE066] rounded-xl font-bold transition-transform active:scale-95 shadow-sm"
            >
              {isPaused ? <Play size={18} fill="#00421C" /> : <Pause size={18} />}
            </button>

            {/* Next button */}
            <button
              onClick={onNext}
              title="Nächstes Gericht"
              className="p-2 hover:bg-[#005826] rounded-xl transition-colors text-white"
            >
              <ChevronRight size={18} />
            </button>

            {/* Speed / Duration Selector Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                title="Slider Geschwindigkeit einstellen"
                className={`p-2 rounded-xl transition-colors ${
                  showSettings ? 'bg-[#005826] text-[#F4C414]' : 'hover:bg-[#005826] text-white'
                }`}
              >
                <Settings size={18} />
              </button>

              {/* Speed Popover */}
              {showSettings && (
                <div className="absolute bottom-12 right-0 bg-[#002E13] text-white p-3 rounded-xl shadow-xl border border-[#005826] min-w-[190px] space-y-2">
                  <div className="text-xs font-bold text-[#F4C414] uppercase tracking-wider">
                    Wechsel-Intervall
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[6, 9, 12].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => {
                          onChangeDuration(sec);
                          setShowSettings(false);
                        }}
                        className={`text-xs py-1.5 rounded-lg font-bold transition-all ${
                          slideDuration === sec
                            ? 'bg-[#F4C414] text-[#00421C]'
                            : 'bg-[#005826]/50 hover:bg-[#005826] text-white'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        setShowSettings(false);
                        onOpenAdmin();
                      }}
                      className="w-full py-1.5 px-2 bg-[#005826] hover:bg-[#007533] text-[#F4C414] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShieldAlert size={13} />
                      <span>Admin-Panel öffnen</span>
                    </button>
                    <div className="text-[10px] text-white/60 flex items-center gap-1 pt-0.5">
                      <HelpCircle size={10} />
                      <span>Taste [F] für Vollbild</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Vollbild beenden' : 'Vollbildmodus (Taste [F])'}
              className="p-2 hover:bg-[#005826] rounded-xl transition-colors text-[#F4C414]"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            {/* Admin shortcut button */}
            <button
              onClick={onOpenAdmin}
              title="Admin-Bereich öffnen (/admin)"
              className="p-2 hover:bg-[#005826] rounded-xl transition-colors text-white/70 hover:text-[#F4C414]"
            >
              <ShieldAlert size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
