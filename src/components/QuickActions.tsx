import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalcStore, THEMES } from '@/store/calculatorStore';

export default function QuickActions() {
  const { theme, setPanel, setMode } = useCalcStore();
  const colors = THEMES[theme];
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: '📈', label: 'Graph', action: () => { setPanel('graph'); setIsOpen(false); } },
    { icon: '🤖', label: 'NOVA', action: () => { setPanel('ai'); setIsOpen(false); } },
    { icon: '📐', label: 'Formulas', action: () => { setPanel('formulas'); setIsOpen(false); } },
    { icon: '🔬', label: 'Scientific', action: () => { setMode('scientific'); setIsOpen(false); } },
    { icon: '💻', label: 'Programmer', action: () => { setMode('programmer'); setIsOpen(false); } },
    { icon: '🔄', label: 'Convert', action: () => { setMode('converter'); setIsOpen(false); } },
  ];

  return (
    <>
      {/* FAB trigger */}
      <motion.button
        className="fixed bottom-20 right-4 z-20 w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: `rgba(${colors.primaryRgb}, 0.15)`,
          border: `1px solid rgba(${colors.primaryRgb}, 0.25)`,
          boxShadow: `0 4px 20px rgba(${colors.primaryRgb}, 0.2)`,
          backdropFilter: 'blur(10px)',
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          className="text-lg"
          style={{ color: colors.primary }}
        >
          ✦
        </motion.span>
      </motion.button>

      {/* Radial menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu items */}
            <div className="fixed bottom-20 right-4 z-30">
              {actions.map((action, i) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 20, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    y: -(i + 1) * 56,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, y: 0, scale: 0.5 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={action.action}
                  className="absolute bottom-0 right-0 flex items-center gap-2"
                >
                  <span
                    className="text-xs font-mono px-2 py-1 rounded-lg whitespace-nowrap"
                    style={{
                      background: `rgba(${colors.primaryRgb}, 0.1)`,
                      color: colors.primary,
                      border: `1px solid rgba(${colors.primaryRgb}, 0.2)`,
                    }}
                  >
                    {action.label}
                  </span>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `rgba(${colors.primaryRgb}, 0.12)`,
                      border: `1px solid rgba(${colors.primaryRgb}, 0.2)`,
                      boxShadow: `0 2px 12px rgba(${colors.primaryRgb}, 0.15)`,
                    }}
                  >
                    {action.icon}
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
