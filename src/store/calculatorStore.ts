import { create } from 'zustand';
import * as math from 'mathjs';

export type ThemeId = 'neon-blue' | 'neon-purple' | 'neon-green' | 'neon-red' | 'neon-orange' | 'galaxy' | 'matrix' | 'fire' | 'ice' | 'electric' | 'space' | 'ai';

export interface ThemeColors {
  primary: string;
  primaryRgb: string;
  secondary: string;
  accent: string;
  bg1: string;
  bg2: string;
  glow: string;
}

export const THEMES: Record<ThemeId, ThemeColors> = {
  'neon-blue': { primary: '#00d4ff', primaryRgb: '0,212,255', secondary: '#0088cc', accent: '#00ffff', bg1: '#050510', bg2: '#0a0a1a', glow: 'rgba(0,212,255,0.3)' },
  'neon-purple': { primary: '#a855f7', primaryRgb: '168,85,247', secondary: '#7c3aed', accent: '#c084fc', bg1: '#080510', bg2: '#0f0a1a', glow: 'rgba(168,85,247,0.3)' },
  'neon-green': { primary: '#00ff88', primaryRgb: '0,255,136', secondary: '#00cc6a', accent: '#4ade80', bg1: '#051008', bg2: '#0a1a0f', glow: 'rgba(0,255,136,0.3)' },
  'neon-red': { primary: '#ff3366', primaryRgb: '255,51,102', secondary: '#cc1144', accent: '#ff6690', bg1: '#100508', bg2: '#1a0a0f', glow: 'rgba(255,51,102,0.3)' },
  'neon-orange': { primary: '#ff6b35', primaryRgb: '255,107,53', secondary: '#e65100', accent: '#ff9800', bg1: '#100805', bg2: '#1a0f0a', glow: 'rgba(255,107,53,0.3)' },
  'galaxy': { primary: '#7c4dff', primaryRgb: '124,77,255', secondary: '#536dfe', accent: '#e040fb', bg1: '#05050f', bg2: '#0a0a1f', glow: 'rgba(124,77,255,0.3)' },
  'matrix': { primary: '#00ff41', primaryRgb: '0,255,65', secondary: '#00cc33', accent: '#33ff77', bg1: '#000800', bg2: '#001100', glow: 'rgba(0,255,65,0.3)' },
  'fire': { primary: '#ff4500', primaryRgb: '255,69,0', secondary: '#ff8c00', accent: '#ffd700', bg1: '#0f0500', bg2: '#1a0a00', glow: 'rgba(255,69,0,0.3)' },
  'ice': { primary: '#00bcd4', primaryRgb: '0,188,212', secondary: '#4dd0e1', accent: '#80deea', bg1: '#050a0f', bg2: '#0a1520', glow: 'rgba(0,188,212,0.3)' },
  'electric': { primary: '#ffea00', primaryRgb: '255,234,0', secondary: '#ffc400', accent: '#fff176', bg1: '#0a0a05', bg2: '#15150a', glow: 'rgba(255,234,0,0.3)' },
  'space': { primary: '#e1bee7', primaryRgb: '225,190,231', secondary: '#9c27b0', accent: '#7b1fa2', bg1: '#050508', bg2: '#0a0a12', glow: 'rgba(225,190,231,0.3)' },
  'ai': { primary: '#00e5ff', primaryRgb: '0,229,255', secondary: '#1de9b6', accent: '#76ff03', bg1: '#050810', bg2: '#0a1018', glow: 'rgba(0,229,255,0.3)' },
};

export type CalcMode = 'standard' | 'scientific' | 'programmer' | 'graphing' | 'converter' | 'matrix' | 'statistics' | 'engineering';
export type PanelView = 'calc' | 'history' | 'ai' | 'graph' | 'formulas' | 'settings' | 'modes' | 'themes';
export type AngleMode = 'deg' | 'rad';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  mode: CalcMode;
  favorite: boolean;
}

interface CalcState {
  // Display
  display: string;
  expression: string;
  result: string;
  previousResult: string;
  memory: number;
  hasEvaluated: boolean;

  // Modes
  mode: CalcMode;
  angleMode: AngleMode;
  panel: PanelView;
  theme: ThemeId;
  soundEnabled: boolean;
  particlesEnabled: boolean;

  // History
  history: HistoryItem[];

  // Scientific state
  isInverse: boolean;
  isHyp: boolean;

  // Programmer state
  programmerBase: 2 | 8 | 10 | 16;

  // AI
  aiMessages: { role: 'user' | 'ai'; content: string }[];
  aiInput: string;

  // Graph
  graphExpression: string;

  // Actions
  inputDigit: (digit: string) => void;
  inputOperator: (op: string) => void;
  inputFunction: (fn: string) => void;
  inputConstant: (c: string) => void;
  inputParenthesis: (p: string) => void;
  clear: () => void;
  clearEntry: () => void;
  backspace: () => void;
  evaluate: () => void;
  toggleSign: () => void;
  percentage: () => void;
  factorial: () => void;
  setMode: (mode: CalcMode) => void;
  setAngleMode: (mode: AngleMode) => void;
  setPanel: (panel: PanelView) => void;
  setTheme: (theme: ThemeId) => void;
  toggleInverse: () => void;
  toggleHyp: () => void;
  toggleSound: () => void;
  toggleParticles: () => void;
  memoryStore: () => void;
  memoryRecall: () => void;
  memoryClear: () => void;
  memoryAdd: () => void;
  memorySubtract: () => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
  setProgrammerBase: (base: 2 | 8 | 10 | 16) => void;
  setGraphExpression: (expr: string) => void;
  addAiMessage: (role: 'user' | 'ai', content: string) => void;
  setAiInput: (input: string) => void;
}

const formatResult = (result: any): string => {
  if (typeof result === 'number') {
    if (Number.isNaN(result)) return 'Error';
    if (!Number.isFinite(result)) return result > 0 ? '∞' : '-∞';
    if (Number.isInteger(result) && Math.abs(result) < 1e15) return result.toString();
    if (Math.abs(result) < 0.0001 || Math.abs(result) >= 1e15) {
      return result.toExponential(8);
    }
    const str = result.toPrecision(12);
    return parseFloat(str).toString();
  }
  if (typeof result === 'object' && result !== null) {
    return math.format(result, { precision: 10 });
  }
  return String(result);
};

const evaluateExpression = (expr: string, angleMode: AngleMode): string => {
  try {
    let processed = expr;
    // Replace display symbols
    processed = processed.replace(/×/g, '*');
    processed = processed.replace(/÷/g, '/');
    processed = processed.replace(/−/g, '-');
    processed = processed.replace(/%/g, '/100');
    processed = processed.replace(/π/g, `(${Math.PI})`);
    processed = processed.replace(/e(?![a-z])/gi, `(${Math.E})`);
    processed = processed.replace(/φ/g, `(${(1 + Math.sqrt(5)) / 2})`);

    // Handle implicit multiplication: 2(3) -> 2*(3), (3)(4) -> (3)*(4)
    processed = processed.replace(/(\d)\(/g, '$1*(');
    processed = processed.replace(/\)(\d)/g, ')*$1');
    processed = processed.replace(/\)\(/g, ')*(');

    // Handle angle conversions for trig
    if (angleMode === 'deg') {
      const trigFns = ['sin', 'cos', 'tan'];
      trigFns.forEach(fn => {
        const regex = new RegExp(`${fn}\\(`, 'g');
        processed = processed.replace(regex, `${fn}((pi/180)*`);
      });
      const invTrigFns = ['asin', 'acos', 'atan'];
      invTrigFns.forEach(fn => {
        const regex = new RegExp(`${fn}\\(`, 'g');
        processed = processed.replace(regex, `(180/pi)*${fn}(`);
      });
    }

    const result = math.evaluate(processed);
    return formatResult(result);
  } catch {
    return 'Error';
  }
};

export const useCalcStore = create<CalcState>((set, get) => ({
  display: '0',
  expression: '',
  result: '',
  previousResult: '',
  memory: 0,
  hasEvaluated: false,

  mode: 'standard',
  angleMode: 'deg',
  panel: 'calc',
  theme: 'neon-blue',
  soundEnabled: false,
  particlesEnabled: true,

  history: [],

  isInverse: false,
  isHyp: false,

  programmerBase: 10,

  aiMessages: [
    { role: 'ai', content: 'Hello! I\'m NOVA AI, your computational assistant. I can help with math, science, engineering, programming, and more. Ask me anything!' }
  ],
  aiInput: '',

  graphExpression: 'sin(x)',

  inputDigit: (digit) => {
    const { display, hasEvaluated } = get();
    if (hasEvaluated) {
      set({ display: digit, expression: '', hasEvaluated: false, result: '' });
    } else if (display === '0' && digit !== '.') {
      set({ display: digit });
    } else if (digit === '.' && display.includes('.')) {
      return;
    } else {
      set({ display: display + digit });
    }
  },

  inputOperator: (op) => {
    const { display, expression, hasEvaluated, result } = get();
    if (hasEvaluated && result) {
      set({
        expression: result + ' ' + op + ' ',
        display: '0',
        hasEvaluated: false,
        result: '',
      });
    } else {
      set({
        expression: (expression || '') + display + ' ' + op + ' ',
        display: '0',
        hasEvaluated: false,
      });
    }
  },

  inputFunction: (fn) => {
    const { display, hasEvaluated, result } = get();
    const val = hasEvaluated && result ? result : display;
    let newExpr = '';

    switch (fn) {
      case 'sin': case 'cos': case 'tan':
      case 'asin': case 'acos': case 'atan':
      case 'sinh': case 'cosh': case 'tanh':
      case 'log': case 'log10': case 'log2':
      case 'sqrt': case 'cbrt': case 'abs':
      case 'ceil': case 'floor': case 'round':
      case 'exp':
        newExpr = `${fn}(${val})`;
        break;
      case 'ln':
        newExpr = `log(${val})`;
        break;
      case 'x²':
        newExpr = `(${val})^2`;
        break;
      case 'x³':
        newExpr = `(${val})^3`;
        break;
      case '10ˣ':
        newExpr = `10^(${val})`;
        break;
      case '2ˣ':
        newExpr = `2^(${val})`;
        break;
      case 'eˣ':
        newExpr = `e^(${val})`;
        break;
      case '1/x':
        newExpr = `1/(${val})`;
        break;
      case '√':
        newExpr = `sqrt(${val})`;
        break;
      case '∛':
        newExpr = `cbrt(${val})`;
        break;
      default:
        newExpr = `${fn}(${val})`;
    }

    try {
      const res = evaluateExpression(newExpr, get().angleMode);
      set({
        display: res,
        expression: newExpr,
        result: res,
        hasEvaluated: true,
      });
    } catch {
      set({ display: 'Error', result: 'Error', hasEvaluated: true });
    }
  },

  inputConstant: (c) => {
    let value = '';
    switch (c) {
      case 'π': value = Math.PI.toString(); break;
      case 'e': value = Math.E.toString(); break;
      case 'φ': value = ((1 + Math.sqrt(5)) / 2).toString(); break;
      case '∞': value = 'Infinity'; break;
      default: value = c;
    }
    const { hasEvaluated } = get();
    if (hasEvaluated) {
      set({ display: value, expression: c, hasEvaluated: false, result: '' });
    } else {
      set({ display: value });
    }
  },

  inputParenthesis: (p) => {
    const { display, hasEvaluated } = get();
    if (hasEvaluated) {
      set({ display: p, expression: '', hasEvaluated: false, result: '' });
    } else if (display === '0') {
      set({ display: p });
    } else {
      set({ display: display + p });
    }
  },

  clear: () => set({ display: '0', expression: '', result: '', hasEvaluated: false }),

  clearEntry: () => set({ display: '0' }),

  backspace: () => {
    const { display, hasEvaluated } = get();
    if (hasEvaluated) {
      set({ display: '0', expression: '', result: '', hasEvaluated: false });
      return;
    }
    if (display.length <= 1) {
      set({ display: '0' });
    } else {
      set({ display: display.slice(0, -1) });
    }
  },

  evaluate: () => {
    const { display, expression, angleMode, mode, hasEvaluated } = get();
    void mode; // used for history
    if (hasEvaluated) return;

    const fullExpr = expression + display;
    if (!fullExpr || fullExpr === '0') return;

    const res = evaluateExpression(fullExpr, angleMode);
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      expression: fullExpr,
      result: res,
      timestamp: Date.now(),
      mode,
      favorite: false,
    };

    set((state) => ({
      display: res,
      result: res,
      expression: fullExpr + ' =',
      previousResult: res,
      hasEvaluated: true,
      history: [historyItem, ...state.history].slice(0, 200),
    }));
  },

  toggleSign: () => {
    const { display } = get();
    if (display === '0') return;
    if (display.startsWith('-')) {
      set({ display: display.slice(1) });
    } else {
      set({ display: '-' + display });
    }
  },

  percentage: () => {
    const { display } = get();
    try {
      const val = parseFloat(display) / 100;
      set({ display: val.toString() });
    } catch {
      set({ display: 'Error' });
    }
  },

  factorial: () => {
    const { display } = get();
    try {
      const n = parseInt(display);
      if (n < 0 || n > 170) { set({ display: 'Error' }); return; }
      const result = math.factorial(n);
      set({ display: formatResult(result as number), result: formatResult(result as number), hasEvaluated: true });
    } catch {
      set({ display: 'Error' });
    }
  },

  setMode: (mode) => set({ mode, panel: 'calc' }),
  setAngleMode: (mode) => set({ angleMode: mode }),
  setPanel: (panel) => set({ panel }),
  setTheme: (theme) => set({ theme }),
  toggleInverse: () => set((s) => ({ isInverse: !s.isInverse })),
  toggleHyp: () => set((s) => ({ isHyp: !s.isHyp })),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  toggleParticles: () => set((s) => ({ particlesEnabled: !s.particlesEnabled })),

  memoryStore: () => {
    const { display, result, hasEvaluated } = get();
    const val = parseFloat(hasEvaluated && result ? result : display) || 0;
    set({ memory: val });
  },
  memoryRecall: () => {
    const { memory } = get();
    set({ display: memory.toString(), hasEvaluated: false });
  },
  memoryClear: () => set({ memory: 0 }),
  memoryAdd: () => {
    const { display, result, hasEvaluated, memory } = get();
    const val = parseFloat(hasEvaluated && result ? result : display) || 0;
    set({ memory: memory + val });
  },
  memorySubtract: () => {
    const { display, result, hasEvaluated, memory } = get();
    const val = parseFloat(hasEvaluated && result ? result : display) || 0;
    set({ memory: memory - val });
  },

  toggleFavorite: (id) => set((s) => ({
    history: s.history.map(h => h.id === id ? { ...h, favorite: !h.favorite } : h)
  })),

  clearHistory: () => set({ history: [] }),

  setProgrammerBase: (base) => set({ programmerBase: base }),
  setGraphExpression: (expr) => set({ graphExpression: expr }),

  addAiMessage: (role, content) => set((s) => ({
    aiMessages: [...s.aiMessages, { role, content }]
  })),
  setAiInput: (input) => set({ aiInput: input }),
}));
