import { useCalcStore, THEMES } from '@/store/calculatorStore';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Display() {
  const { display, expression, hasEvaluated, mode, angleMode, memory, theme } = useCalcStore();
  const colors = THEMES[theme];
  const displayRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const getFontSize = () => {
    const len = display.length;
    if (len <= 6) return 'text-[48px]';
    if (len <= 8) return 'text-[42px]';
    if (len <= 10) return 'text-[36px]';
    if (len <= 14) return 'text-[28px]';
    if (len <= 18) return 'text-[22px]';
    return 'text-[18px]';
  };

  const handleDoubleTap = () => {
    navigator.clipboard?.writeText(display).then(() => {
      setCopied(true);
      if (navigator.vibrate) navigator.vibrate(15);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const lastTap = useRef(0);
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleDoubleTap();
    }
    lastTap.current = now;
  };

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [display]);

  return (
    <div className="relative px-5 pt-1 pb-4 flex flex-col items-end justify-end min-h-[160px]">
      {/* Status badges */}
      <div className="w-full flex items-center justify-between mb-2 px-0.5">
        <div className="flex items-center gap-1.5">
          <span
            className="text-[9px] font-display font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{
              color: colors.primary,
              background: `rgba(${colors.primaryRgb}, 0.08)`,
              border: `1px solid rgba(${colors.primaryRgb}, 0.15)`,
              textShadow: `0 0 8px rgba(${colors.primaryRgb}, 0.3)`,
            }}
          >
            {mode}
          </span>
          <span
            className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-full"
            style={{
              color: `rgba(${colors.primaryRgb}, 0.6)`,
              background: `rgba(${colors.primaryRgb}, 0.05)`,
              border: `1px solid rgba(${colors.primaryRgb}, 0.1)`,
            }}
          >
            {angleMode}
          </span>
          {memory !== 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-full"
              style={{
                color: '#ff9800',
                background: 'rgba(255,152,0,0.08)',
                border: '1px solid rgba(255,152,0,0.15)',
              }}
            >
              M
            </motion.span>
          )}
        </div>
        <div className="font-display text-[8px] tracking-[0.2em] opacity-20"
          style={{ color: colors.primary }}>
          INFINITY OS
        </div>
      </div>

      {/* Expression */}
      <div
        className="w-full text-right text-[13px] font-mono overflow-x-auto whitespace-nowrap mb-1.5 pr-0.5 h-5"
        style={{ color: `rgba(${colors.primaryRgb}, 0.4)` }}
      >
        {expression || '\u00A0'}
      </div>

      {/* Main result display */}
      <div
        ref={displayRef}
        className={`w-full text-right font-mono font-extrabold overflow-x-auto whitespace-nowrap result-text cursor-pointer leading-tight ${getFontSize()}`}
        style={{
          color: hasEvaluated ? colors.primary : '#ffffff',
          textShadow: hasEvaluated
            ? `0 0 20px rgba(${colors.primaryRgb}, 0.4), 0 0 60px rgba(${colors.primaryRgb}, 0.15)`
            : '0 2px 4px rgba(0,0,0,0.3)',
        }}
        onClick={handleTap}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: 12, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -12, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Copy toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute bottom-3 right-5 text-[11px] font-mono px-3 py-1.5 rounded-full"
            style={{
              background: `rgba(${colors.primaryRgb}, 0.15)`,
              color: colors.primary,
              border: `1px solid rgba(${colors.primaryRgb}, 0.25)`,
              boxShadow: `0 0 15px rgba(${colors.primaryRgb}, 0.15)`,
            }}
          >
            ✓ Copied
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom separator with glow */}
      <div className="absolute bottom-0 left-6 right-6">
        <div
          className="h-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${colors.primaryRgb}, 0.25), transparent)`,
          }}
        />
        <div
          className="h-[2px] blur-sm"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${colors.primaryRgb}, 0.15), transparent)`,
          }}
        />
      </div>
    </div>
  );
}
