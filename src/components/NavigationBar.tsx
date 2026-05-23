import { useCalcStore, THEMES, PanelView } from '@/store/calculatorStore';
import { motion } from 'framer-motion';

const NAV_ITEMS: { id: PanelView; icon: string; activeIcon: string; label: string }[] = [
  { id: 'history', icon: '◷', activeIcon: '◷', label: 'History' },
  { id: 'formulas', icon: '∑', activeIcon: '∑', label: 'Formulas' },
  { id: 'calc', icon: '⬡', activeIcon: '⬡', label: 'Calc' },
  { id: 'graph', icon: '◠', activeIcon: '◠', label: 'Graph' },
  { id: 'ai', icon: '◈', activeIcon: '◈', label: 'Nova' },
];

export default function NavigationBar() {
  const { panel, setPanel, theme } = useCalcStore();
  const colors = THEMES[theme];

  return (
    <div className="relative px-4 py-1.5 safe-bottom"
      style={{
        background: 'rgba(5,5,12,0.9)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
      }}
    >
      {/* Top edge glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${colors.primaryRgb}, 0.1), transparent)`,
        }}
      />

      <div className="flex items-center justify-around">
        {NAV_ITEMS.map(item => {
          const isActive = panel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPanel(item.id)}
              className="relative flex flex-col items-center gap-1 py-1 px-5 rounded-2xl transition-all active:scale-90"
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="navDot"
                  className="absolute -top-0.5 w-4 h-[2px] rounded-full"
                  style={{
                    background: colors.primary,
                    boxShadow: `0 0 8px ${colors.primary}, 0 0 20px rgba(${colors.primaryRgb}, 0.3)`,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* Icon */}
              <motion.span
                className="text-[18px] leading-none font-bold"
                animate={{
                  color: isActive ? colors.primary : 'rgba(255,255,255,0.2)',
                  textShadow: isActive
                    ? `0 0 12px rgba(${colors.primaryRgb}, 0.5)`
                    : '0 0 0px transparent',
                }}
                style={{ fontFamily: 'system-ui' }}
              >
                {isActive ? item.activeIcon : item.icon}
              </motion.span>

              {/* Label */}
              <span
                className="text-[9px] font-mono font-bold tracking-wider"
                style={{
                  color: isActive ? colors.primary : 'rgba(255,255,255,0.15)',
                }}
              >
                {item.label}
              </span>

              {/* Active background glow */}
              {isActive && (
                <motion.div
                  layoutId="navGlow"
                  className="absolute inset-0 rounded-2xl -z-10"
                  style={{
                    background: `radial-gradient(circle, rgba(${colors.primaryRgb}, 0.06) 0%, transparent 70%)`,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
