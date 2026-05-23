import { useCalcStore, THEMES } from '@/store/calculatorStore';
import { motion } from 'framer-motion';

export default function TopBar() {
  const { mode, theme, setPanel } = useCalcStore();
  const colors = THEMES[theme];

  const getModeIcon = () => {
    switch (mode) {
      case 'standard': return '⊞';
      case 'scientific': return '∿';
      case 'programmer': return '⟨⟩';
      case 'graphing': return '📈';
      case 'converter': return '⟲';
      case 'matrix': return '▦';
      case 'statistics': return '◕';
      case 'engineering': return '⚡';
      default: return '⊞';
    }
  };

  return (
    <div
      className="flex items-center justify-between px-4 py-2 safe-top"
      style={{ background: 'transparent' }}
    >
      {/* Mode selector */}
      <motion.button
        onClick={() => setPanel('modes')}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl active:scale-95 transition-transform"
        style={{
          background: `rgba(${colors.primaryRgb}, 0.06)`,
          border: `1px solid rgba(${colors.primaryRgb}, 0.1)`,
        }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-base" style={{ color: colors.primary }}>{getModeIcon()}</span>
        <span
          className="text-[11px] font-mono font-semibold capitalize"
          style={{ color: `rgba(${colors.primaryRgb}, 0.8)` }}
        >
          {mode}
        </span>
        <span className="text-[8px]" style={{ color: `rgba(${colors.primaryRgb}, 0.3)` }}>▾</span>
      </motion.button>

      {/* Center - Live clock/brand */}
      <div className="flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{
            background: colors.primary,
            boxShadow: `0 0 6px ${colors.primary}`,
          }}
        />
        <span
          className="font-display text-[9px] tracking-[0.15em] font-bold"
          style={{ color: `rgba(${colors.primaryRgb}, 0.25)` }}
        >
          CX∞
        </span>
      </div>

      {/* Settings */}
      <motion.button
        onClick={() => setPanel('settings')}
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl active:scale-95 transition-transform"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-base">⚙</span>
      </motion.button>
    </div>
  );
}
