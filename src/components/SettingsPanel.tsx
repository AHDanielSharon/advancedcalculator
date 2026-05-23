import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCalcStore, THEMES, ThemeId } from '@/store/calculatorStore';

export default function SettingsPanel() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    setIsInstalled(!!isStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // Check if installable (deferredPrompt exists)
    if (window.deferredPrompt) {
      setIsInstallable(true);
    }

    const handleInstallable = () => {
      setIsInstallable(true);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) return;

    // Show the install prompt
    promptEvent.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again
    window.deferredPrompt = null;
    setIsInstallable(false);
  };
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

        {/* PWA Install Section */}
        <div className="glass rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider">App Installation</h3>
          
          <div className="flex items-center gap-4">
            {/* Catchy App Icon with Glow */}
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
                 style={{ 
                   border: `1px solid rgba(${colors.primaryRgb}, 0.3)`,
                   boxShadow: `0 0 20px rgba(${colors.primaryRgb}, 0.25)` 
                 }}
            >
              <img 
                src="icon.png" 
                alt="Calculus X Icon" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-bold text-white">Calculus X ∞</h4>
              <p className="text-[10px] text-white/50 leading-relaxed font-mono">
                Install Infinity OS on your mobile home screen for a native, full-screen, and offline computational experience.
              </p>
            </div>
          </div>

          {isInstalled ? (
            <div 
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold border"
              style={{
                background: `rgba(${colors.primaryRgb}, 0.05)`,
                borderColor: `rgba(${colors.primaryRgb}, 0.2)`,
                color: colors.primary
              }}
            >
              <span>✅ STATUS: STANDALONE ACTIVE</span>
            </div>
          ) : isInstallable ? (
            <motion.button
              onClick={handleInstallClick}
              whileTap={{ scale: 0.96 }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all relative overflow-hidden group active:scale-95 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                boxShadow: `0 4px 15px rgba(${colors.primaryRgb}, 0.3)`,
                color: '#050510'
              }}
            >
              <span>INSTALL CALCULUS X</span>
            </motion.button>
          ) : isIOS ? (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-[10px] font-mono text-white/70 flex items-center gap-1.5">
                <span>📱</span>
                <span className="font-bold text-white/90">iOS Installation Guide:</span>
              </div>
              <p className="text-[9px] text-white/50 leading-relaxed font-mono">
                Tap the <span className="text-white font-bold">Share button ⎋</span> at the bottom of Safari, scroll down, and select <span className="text-white font-bold">Add to Home Screen ⊞</span>.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-[10px] text-white/40 font-mono">
                To install, open this site in Google Chrome or Safari on your phone, then tap the menu options.
              </p>
            </div>
          )}
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
