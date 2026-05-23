import { motion } from 'framer-motion';
import { useCalcStore, THEMES, ThemeId } from '@/store/calculatorStore';

export default function SettingsPanel() {
  const {
    theme, setTheme, soundEnabled, toggleSound,
    particlesEnabled, toggleParticles, angleMode, setAngleMode, setPanel,
  } = useCalcStore();
  const colors = THEMES[theme];

  const themeList: { id: ThemeId; name: string; icon: string }[] = [
    { id: 'neon-blue', name: 'Neon Blue', icon: '💎' },
    { id: 'neon-purple', name: 'Neon Purple', icon: '🔮' },
    { id: 'neon-green', name: 'Neon Green', icon: '💚' },
    { id: 'neon-red', name: 'Neon Red', icon: '❤️' },
    { id: 'neon-orange', name: 'Neon Orange', icon: '🧡' },
    { id: 'galaxy', name: 'Galaxy', icon: '🌌' },
    { id: 'matrix', name: 'Matrix', icon: '🟢' },
    { id: 'fire', name: 'Fire', icon: '🔥' },
    { id: 'ice', name: 'Ice', icon: '❄️' },
    { id: 'electric', name: 'Electric', icon: '⚡' },
    { id: 'space', name: 'Space', icon: '🚀' },
    { id: 'ai', name: 'AI', icon: '🤖' },
  ];

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="absolute inset-0 z-30 flex flex-col"
      style={{ background: 'rgba(5,5,10,0.98)' }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={() => setPanel('calc')} className="text-2xl" style={{ color: colors.primary }}>
          ←
        </button>
        <h2 className="font-display text-sm tracking-widest" style={{ color: colors.primary }}>
          SETTINGS
        </h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">
        {/* Themes */}
        <div>
          <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3">Themes</h3>
          <div className="grid grid-cols-3 gap-2">
            {themeList.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="rounded-xl p-3 text-left active:scale-[0.96] transition-all"
                style={{
                  background: theme === t.id
                    ? `rgba(${THEMES[t.id].primaryRgb}, 0.15)`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${theme === t.id
                    ? `rgba(${THEMES[t.id].primaryRgb}, 0.3)`
                    : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                <div className="text-lg mb-1">{t.icon}</div>
                <div className="text-[10px] font-mono" style={{
                  color: theme === t.id ? THEMES[t.id].primary : 'rgba(255,255,255,0.4)',
                }}>{t.name}</div>
                <div
                  className="w-full h-1 rounded-full mt-2"
                  style={{ background: THEMES[t.id].primary }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3">Preferences</h3>

          {/* Sound */}
          <button
            onClick={toggleSound}
            className="w-full flex items-center justify-between glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{soundEnabled ? '🔊' : '🔇'}</span>
              <div className="text-left">
                <div className="text-sm font-medium">Sound Effects</div>
                <div className="text-[10px] text-white/30 font-mono">Sci-fi button sounds</div>
              </div>
            </div>
            <div
              className="w-12 h-7 rounded-full relative transition-colors"
              style={{
                background: soundEnabled ? `rgba(${colors.primaryRgb}, 0.3)` : 'rgba(255,255,255,0.1)',
              }}
            >
              <div
                className="absolute top-1 w-5 h-5 rounded-full transition-all"
                style={{
                  left: soundEnabled ? '24px' : '4px',
                  background: soundEnabled ? colors.primary : 'rgba(255,255,255,0.3)',
                  boxShadow: soundEnabled ? `0 0 10px ${colors.glow}` : 'none',
                }}
              />
            </div>
          </button>

          {/* Particles */}
          <button
            onClick={toggleParticles}
            className="w-full flex items-center justify-between glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">✨</span>
              <div className="text-left">
                <div className="text-sm font-medium">Particle Effects</div>
                <div className="text-[10px] text-white/30 font-mono">Animated background particles</div>
              </div>
            </div>
            <div
              className="w-12 h-7 rounded-full relative transition-colors"
              style={{
                background: particlesEnabled ? `rgba(${colors.primaryRgb}, 0.3)` : 'rgba(255,255,255,0.1)',
              }}
            >
              <div
                className="absolute top-1 w-5 h-5 rounded-full transition-all"
                style={{
                  left: particlesEnabled ? '24px' : '4px',
                  background: particlesEnabled ? colors.primary : 'rgba(255,255,255,0.3)',
                  boxShadow: particlesEnabled ? `0 0 10px ${colors.glow}` : 'none',
                }}
              />
            </div>
          </button>

          {/* Angle Mode */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg">📐</span>
              <div>
                <div className="text-sm font-medium">Angle Mode</div>
                <div className="text-[10px] text-white/30 font-mono">For trigonometric functions</div>
              </div>
            </div>
            <div className="flex gap-2">
              {(['deg', 'rad'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setAngleMode(mode)}
                  className="flex-1 py-2 rounded-lg text-sm font-mono font-bold uppercase transition-colors"
                  style={{
                    background: angleMode === mode ? `rgba(${colors.primaryRgb}, 0.2)` : 'rgba(255,255,255,0.03)',
                    color: angleMode === mode ? colors.primary : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${angleMode === mode ? `rgba(${colors.primaryRgb}, 0.3)` : 'rgba(255,255,255,0.05)'}`,
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass rounded-xl p-4 text-center">
          <div className="font-display text-lg tracking-widest mb-1" style={{ color: colors.primary }}>
            CALCULUS X ∞
          </div>
          <div className="text-[10px] text-white/30 font-mono">
            Infinity OS v1.0 • Computational Operating System
          </div>
          <div className="text-[10px] text-white/20 font-mono mt-1">
            The Most Advanced Calculator Ever Created
          </div>
        </div>
      </div>
    </motion.div>
  );
}
