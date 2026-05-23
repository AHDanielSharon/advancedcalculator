import { motion } from 'framer-motion';
import { useCalcStore, THEMES } from '@/store/calculatorStore';

export default function HistoryPanel() {
  const { history, theme, toggleFavorite, clearHistory, setPanel } = useCalcStore();
  const colors = THEMES[theme];

  const store = useCalcStore.getState;

  const loadHistoryItem = (expr: string, res: string) => {
    const s = store();
    s.clear();
    // Set display to result for quick reuse
    useCalcStore.setState({ display: res, expression: expr + ' =', result: res, hasEvaluated: true });
    setPanel('calc');
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="absolute inset-0 z-30 flex flex-col"
      style={{ background: 'rgba(5,5,10,0.98)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={() => setPanel('calc')} className="text-2xl" style={{ color: colors.primary }}>
          ←
        </button>
        <h2 className="font-display text-sm tracking-widest" style={{ color: colors.primary }}>
          HISTORY
        </h2>
        <button
          onClick={clearHistory}
          className="text-xs font-mono px-3 py-1 rounded-full"
          style={{
            color: '#ff6b6b',
            background: 'rgba(255,100,100,0.1)',
            border: '1px solid rgba(255,100,100,0.2)',
          }}
        >
          Clear
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-sm font-mono">No calculations yet</p>
          </div>
        ) : (
          history.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              className="glass rounded-xl p-3 active:scale-[0.98] transition-transform"
              onClick={() => loadHistoryItem(item.expression, item.result)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-white/40 truncate">{item.expression}</p>
                  <p
                    className="text-lg font-mono font-bold mt-0.5 truncate"
                    style={{ color: colors.primary }}
                  >
                    = {item.result}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                    className="text-lg"
                  >
                    {item.favorite ? '⭐' : '☆'}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-white/20">{formatTime(item.timestamp)}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{
                  background: `rgba(${colors.primaryRgb}, 0.1)`,
                  color: `rgba(${colors.primaryRgb}, 0.5)`,
                }}>
                  {item.mode}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
