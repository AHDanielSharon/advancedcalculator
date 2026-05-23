import { useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useCalcStore, THEMES } from '@/store/calculatorStore';

interface CalcButtonProps {
  label: string;
  subLabel?: string;
  onClick: () => void;
  onLongPress?: () => void;
  variant?: 'number' | 'operator' | 'function' | 'action' | 'equals' | 'memory';
  span?: number;
  className?: string;
}

export default function CalcButton({
  label, subLabel, onClick, onLongPress, variant = 'number', span = 1, className = ''
}: CalcButtonProps) {
  const theme = useCalcStore(s => s.theme);
  const soundEnabled = useCalcStore(s => s.soundEnabled);
  const colors = THEMES[theme];
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isLongPress = useRef(false);
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null);

  const getStyles = () => {
    switch (variant) {
      case 'number':
        return {
          bg: 'rgba(255,255,255,0.04)',
          activeBg: 'rgba(255,255,255,0.12)',
          color: '#ffffffee',
          border: 'rgba(255,255,255,0.06)',
          shadow: '0 2px 8px rgba(0,0,0,0.3)',
        };
      case 'operator':
        return {
          bg: `rgba(${colors.primaryRgb}, 0.1)`,
          activeBg: `rgba(${colors.primaryRgb}, 0.25)`,
          color: colors.primary,
          border: `rgba(${colors.primaryRgb}, 0.18)`,
          shadow: `0 2px 12px rgba(${colors.primaryRgb}, 0.1)`,
        };
      case 'function':
        return {
          bg: 'rgba(255,255,255,0.025)',
          activeBg: 'rgba(255,255,255,0.08)',
          color: `rgba(${colors.primaryRgb}, 0.75)`,
          border: 'rgba(255,255,255,0.04)',
          shadow: '0 2px 6px rgba(0,0,0,0.2)',
        };
      case 'action':
        return {
          bg: 'rgba(255,80,80,0.06)',
          activeBg: 'rgba(255,80,80,0.15)',
          color: '#ff6b6b',
          border: 'rgba(255,80,80,0.1)',
          shadow: '0 2px 8px rgba(0,0,0,0.2)',
        };
      case 'equals':
        return {
          bg: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          activeBg: colors.secondary,
          color: '#000000',
          border: colors.primary,
          shadow: `0 4px 20px rgba(${colors.primaryRgb}, 0.35), 0 0 40px rgba(${colors.primaryRgb}, 0.1)`,
        };
      case 'memory':
        return {
          bg: 'rgba(255,255,255,0.015)',
          activeBg: 'rgba(255,255,255,0.05)',
          color: `rgba(${colors.primaryRgb}, 0.5)`,
          border: 'rgba(255,255,255,0.03)',
          shadow: 'none',
        };
      default:
        return {
          bg: 'rgba(255,255,255,0.04)',
          activeBg: 'rgba(255,255,255,0.12)',
          color: '#ffffff',
          border: 'rgba(255,255,255,0.06)',
          shadow: '0 2px 8px rgba(0,0,0,0.2)',
        };
    }
  };

  const styles = getStyles();

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ac = new AudioContext();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.frequency.value = variant === 'equals' ? 880 : variant === 'operator' ? 660 : 440 + Math.random() * 40;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.02, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.08);
    } catch {}
  }, [soundEnabled, variant]);

  const triggerRipple = (e: React.TouchEvent | React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setRipplePos({ x: clientX - rect.left, y: clientY - rect.top });
    setTimeout(() => setRipplePos(null), 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    triggerRipple(e);
    isLongPress.current = false;
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        if (navigator.vibrate) navigator.vibrate(30);
        onLongPress();
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (!isLongPress.current) {
      playSound();
      if (navigator.vibrate) navigator.vibrate(3);
      onClick();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if ('ontouchstart' in window) { e.preventDefault(); return; }
    triggerRipple(e);
    playSound();
    onClick();
  };

  const isEquals = variant === 'equals';

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 600, damping: 25 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => clearTimeout(longPressTimer.current)}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-2xl flex flex-col items-center justify-center select-none transition-shadow duration-150 ${className}`}
      style={{
        gridColumn: span > 1 ? `span ${span}` : undefined,
        background: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`,
        fontSize: variant === 'function' || variant === 'memory' ? '13px' : '20px',
        fontFamily: variant === 'number' || variant === 'equals' ? "'Inter', sans-serif" : "'JetBrains Mono', monospace",
        fontWeight: variant === 'number' ? 600 : variant === 'equals' ? 800 : 500,
        minHeight: variant === 'memory' ? '40px' : '56px',
        boxShadow: styles.shadow,
        letterSpacing: variant === 'function' ? '-0.02em' : '0',
      }}
    >
      {/* Shine/highlight on top */}
      {(variant === 'number' || variant === 'operator' || variant === 'equals') && (
        <div className="absolute inset-x-0 top-0 h-[1px]" style={{
          background: variant === 'equals'
            ? 'rgba(255,255,255,0.3)'
            : 'rgba(255,255,255,0.04)',
        }} />
      )}

      <span className="relative z-10 leading-none">{label}</span>
      {subLabel && (
        <span className="relative z-10 text-[8px] opacity-35 mt-0.5 font-mono">{subLabel}</span>
      )}

      {/* Ripple effect */}
      {ripplePos && (
        <span
          className="absolute pointer-events-none rounded-full touch-ripple"
          style={{
            left: ripplePos.x - 20,
            top: ripplePos.y - 20,
            width: 40,
            height: 40,
            background: isEquals ? 'rgba(255,255,255,0.3)' : `rgba(${colors.primaryRgb}, 0.25)`,
          }}
        />
      )}
    </motion.button>
  );
}
