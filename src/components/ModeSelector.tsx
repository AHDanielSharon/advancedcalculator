import { motion } from 'framer-motion';
import { useCalcStore, THEMES, CalcMode } from '@/store/calculatorStore';

const MODES: { id: CalcMode; icon: string; name: string; desc: string }[] = [
  { id: 'standard', icon: '🔢', name: 'Standard', desc: 'Basic arithmetic operations' },
  { id: 'scientific', icon: '🔬', name: 'Scientific', desc: 'Advanced math & trig functions' },
  { id: 'programmer', icon: '💻', name: 'Programmer', desc: 'Binary, hex, bitwise ops' },
  { id: 'graphing', icon: '📈', name: 'Graphing', desc: '2D/3D function plots' },
  { id: 'converter', icon: '🔄', name: 'Converter', desc: 'Unit & currency conversion' },
  { id: 'matrix', icon: '📊', name: 'Matrix', desc: 'Matrix operations' },
  { id: 'statistics', icon: '📉', name: 'Statistics', desc: 'Statistical analysis' },
  { id: 'engineering', icon: '⚙️', name: 'Engineering', desc: 'Engineering calculations' },
];

export default function ModeSelector() {
  const { mode, setMode, theme, setPanel } = useCalcStore();
  const colors = THEMES[theme];

  const handleSelectMode = (m: CalcMode) => {
    setMode(m);
    if (m === 'graphing') {
      setPanel('graph');
    } else {
      setPanel('calc');
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute inset-0 z-30 flex flex-col"
      style={{ background: 'rgba(5,5,10,0.98)' }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={() => setPanel('calc')} className="text-2xl" style={{ color: colors.primary }}>
          ←
        </button>
        <h2 className="font-display text-sm tracking-widest" style={{ color: colors.primary }}>
          MODES
        </h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {MODES.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleSelectMode(m.id)}
            className="w-full flex items-center gap-4 rounded-xl p-4 active:scale-[0.98] transition-all"
            style={{
              background: mode === m.id
                ? `rgba(${colors.primaryRgb}, 0.12)`
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${mode === m.id
                ? `rgba(${colors.primaryRgb}, 0.25)`
                : 'rgba(255,255,255,0.05)'}`,
            }}
          >
            <div className="text-2xl">{m.icon}</div>
            <div className="text-left flex-1">
              <div className="text-sm font-semibold" style={{
                color: mode === m.id ? colors.primary : '#fff',
              }}>{m.name}</div>
              <div className="text-[11px] text-white/30 mt-0.5">{m.desc}</div>
            </div>
            {mode === m.id && (
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: colors.primary, boxShadow: `0 0 8px ${colors.primary}` }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
