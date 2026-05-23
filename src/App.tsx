import { useRef, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCalcStore, THEMES } from '@/store/calculatorStore';
import ParticleBackground from '@/components/ParticleBackground';
import Display from '@/components/Display';
import TopBar from '@/components/TopBar';
import NavigationBar from '@/components/NavigationBar';
import StandardKeypad from '@/components/StandardKeypad';
import ScientificKeypad from '@/components/ScientificKeypad';
import ProgrammerKeypad from '@/components/ProgrammerKeypad';
import ConverterKeypad from '@/components/ConverterKeypad';
import StatisticsKeypad from '@/components/StatisticsKeypad';
import EngineeringKeypad from '@/components/EngineeringKeypad';
import MatrixKeypad from '@/components/MatrixKeypad';
import HistoryPanel from '@/components/HistoryPanel';
import NovaAIPanel from '@/components/NovaAIPanel';
import GraphPanel from '@/components/GraphPanel';
import FormulaPanel from '@/components/FormulaPanel';
import SettingsPanel from '@/components/SettingsPanel';
import ModeSelector from '@/components/ModeSelector';
import QuickActions from '@/components/QuickActions';

function App() {
  const { panel, mode, theme, setPanel } = useCalcStore();
  const colors = THEMES[theme];

  // Swipe detection
  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.time;

    // Only detect swipes, not taps
    if (dt > 500) return;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < 60 && absDy < 60) return;

    if (panel !== 'calc') return;

    if (absDx > absDy) {
      // Horizontal swipe
      if (dx > 60) {
        setPanel('history');
      } else if (dx < -60) {
        setPanel('ai');
      }
    } else {
      // Vertical swipe
      if (dy < -60) {
        setPanel('graph');
      } else if (dy > 60) {
        setPanel('formulas');
      }
    }
  }, [panel, setPanel]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const store = useCalcStore.getState();
      if (panel !== 'calc') {
        if (e.key === 'Escape') setPanel('calc');
        return;
      }
      if (e.key >= '0' && e.key <= '9') store.inputDigit(e.key);
      else if (e.key === '.') store.inputDigit('.');
      else if (e.key === '+') store.inputOperator('+');
      else if (e.key === '-') store.inputOperator('−');
      else if (e.key === '*') store.inputOperator('×');
      else if (e.key === '/') { e.preventDefault(); store.inputOperator('÷'); }
      else if (e.key === 'Enter' || e.key === '=') store.evaluate();
      else if (e.key === 'Backspace') store.backspace();
      else if (e.key === 'Escape') store.clear();
      else if (e.key === '%') store.percentage();
      else if (e.key === '(' || e.key === ')') store.inputParenthesis(e.key);
      else if (e.key === '^') store.inputOperator('^');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [panel, setPanel]);

  const renderKeypad = () => {
    switch (mode) {
      case 'scientific': return <ScientificKeypad />;
      case 'programmer': return <ProgrammerKeypad />;
      case 'converter': return <ConverterKeypad />;
      case 'statistics': return <StatisticsKeypad />;
      case 'engineering': return <EngineeringKeypad />;
      case 'matrix': return <MatrixKeypad />;
      default: return <StandardKeypad />;
    }
  };

  // Splash screen
  if (showSplash) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: '#050508' }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <motion.div
            className="font-display text-3xl font-bold tracking-widest mb-2"
            style={{ color: colors.primary, textShadow: `0 0 30px rgba(${colors.primaryRgb}, 0.5)` }}
            animate={{ textShadow: [
              `0 0 30px rgba(${colors.primaryRgb}, 0.3)`,
              `0 0 60px rgba(${colors.primaryRgb}, 0.6)`,
              `0 0 30px rgba(${colors.primaryRgb}, 0.3)`,
            ]}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            CALCULUS X ∞
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xs font-mono tracking-[0.3em]"
            style={{ color: `rgba(${colors.primaryRgb}, 0.5)` }}
          >
            INFINITY OS
          </motion.div>

          {/* Loading bar */}
          <motion.div className="mt-8 w-48 h-[2px] rounded-full overflow-hidden mx-auto"
            style={{ background: `rgba(${colors.primaryRgb}, 0.1)` }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: colors.primary, boxShadow: `0 0 10px ${colors.primary}` }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 text-[10px] font-mono"
            style={{ color: `rgba(${colors.primaryRgb}, 0.3)` }}
          >
            Initializing Computational Engine...
          </motion.div>
        </motion.div>

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(${colors.primaryRgb}, 0.05) 0%, transparent 60%)`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${colors.bg1} 0%, ${colors.bg2} 50%, ${colors.bg1} 100%)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Particle background */}
      <ParticleBackground />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(${colors.primaryRgb}, 0.04) 0%, transparent 50%)`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top bar */}
        <TopBar />

        {/* Display */}
        <div className="flex-shrink-0">
          <Display />
        </div>

        {/* Swipe hints */}
        {panel === 'calc' && (
          <div className="flex justify-between px-6 py-1">
            <span className="text-[8px] font-mono" style={{ color: `rgba(${colors.primaryRgb}, 0.15)` }}>
              ← HISTORY
            </span>
            <span className="text-[8px] font-mono" style={{ color: `rgba(${colors.primaryRgb}, 0.15)` }}>
              ↑ GRAPH
            </span>
            <span className="text-[8px] font-mono" style={{ color: `rgba(${colors.primaryRgb}, 0.15)` }}>
              NOVA →
            </span>
          </div>
        )}

        {/* Keypad area */}
        <div className="flex-1 flex flex-col justify-end overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderKeypad()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation bar */}
        <NavigationBar />
      </div>

      {/* Quick Actions FAB */}
      {panel === 'calc' && <QuickActions />}

      {/* Overlay panels */}
      <AnimatePresence>
        {panel === 'history' && <HistoryPanel />}
        {panel === 'ai' && <NovaAIPanel />}
        {panel === 'graph' && <GraphPanel />}
        {panel === 'formulas' && <FormulaPanel />}
        {panel === 'settings' && <SettingsPanel />}
        {panel === 'modes' && <ModeSelector />}
      </AnimatePresence>
    </div>
  );
}

export default App;
