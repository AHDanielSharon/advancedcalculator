import { useState } from 'react';
import CalcButton from './CalcButton';
import { useCalcStore, THEMES } from '@/store/calculatorStore';

interface Constant {
  name: string;
  symbol: string;
  value: number;
  unit: string;
}

const CONSTANTS: Record<string, Constant[]> = {
  'Physics': [
    { name: 'Speed of Light', symbol: 'c', value: 299792458, unit: 'm/s' },
    { name: 'Planck Constant', symbol: 'h', value: 6.62607015e-34, unit: 'J·s' },
    { name: 'Gravitational', symbol: 'G', value: 6.6743e-11, unit: 'N·m²/kg²' },
    { name: 'Boltzmann', symbol: 'k_B', value: 1.380649e-23, unit: 'J/K' },
    { name: 'Electron Mass', symbol: 'm_e', value: 9.1093837e-31, unit: 'kg' },
    { name: 'Proton Mass', symbol: 'm_p', value: 1.67262192e-27, unit: 'kg' },
    { name: 'Avogadro', symbol: 'N_A', value: 6.02214076e23, unit: 'mol⁻¹' },
    { name: 'Gas Constant', symbol: 'R', value: 8.314462618, unit: 'J/(mol·K)' },
    { name: 'Gravity', symbol: 'g', value: 9.80665, unit: 'm/s²' },
  ],
  'Electrical': [
    { name: 'Elem. Charge', symbol: 'e', value: 1.602176634e-19, unit: 'C' },
    { name: 'Permittivity', symbol: 'ε₀', value: 8.854187817e-12, unit: 'F/m' },
    { name: 'Permeability', symbol: 'μ₀', value: 1.25663706212e-6, unit: 'H/m' },
    { name: 'Coulomb', symbol: 'k_e', value: 8.9875517923e9, unit: 'N·m²/C²' },
  ],
  'Math': [
    { name: 'Pi', symbol: 'π', value: Math.PI, unit: '' },
    { name: 'Euler', symbol: 'e', value: Math.E, unit: '' },
    { name: 'Golden Ratio', symbol: 'φ', value: (1 + Math.sqrt(5)) / 2, unit: '' },
    { name: 'Sqrt(2)', symbol: '√2', value: Math.SQRT2, unit: '' },
  ],
};

export default function EngineeringKeypad() {
  const { theme, inputDigit, inputOperator, clear, backspace, evaluate } = useCalcStore();
  const colors = THEMES[theme];
  const [category, setCategory] = useState('Physics');

  const constants = CONSTANTS[category] || [];

  const insertConstant = (c: Constant) => {
    const store = useCalcStore.getState();
    store.clear();
    store.inputDigit(c.value.toString());
  };

  return (
    <div className="flex flex-col gap-2 px-3 pb-2">
      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {Object.keys(CONSTANTS).map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="flex-shrink-0 text-xs font-mono px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors"
            style={{
              background: category === cat ? `rgba(${colors.primaryRgb}, 0.15)` : 'rgba(255,255,255,0.03)',
              color: category === cat ? colors.primary : 'rgba(255,255,255,0.4)',
              border: `1px solid ${category === cat ? `rgba(${colors.primaryRgb}, 0.2)` : 'rgba(255,255,255,0.05)'}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Constants grid */}
      <div className="glass rounded-xl p-2 max-h-40 overflow-y-auto">
        <div className="grid grid-cols-2 gap-1.5">
          {constants.map(c => (
            <button
              key={c.name}
              onClick={() => insertConstant(c)}
              className="text-left p-2 rounded-lg active:scale-[0.97] transition-transform"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono font-bold" style={{ color: colors.primary }}>{c.symbol}</span>
                <span className="text-[9px] text-white/30 font-mono">{c.unit}</span>
              </div>
              <div className="text-[9px] text-white/40 truncate">{c.name}</div>
              <div className="text-[10px] font-mono text-white/50">{c.value.toExponential(4)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Standard number pad */}
      <div className="grid grid-cols-4 gap-[6px]">
        <CalcButton label="AC" onClick={clear} variant="action" />
        <CalcButton label="(" onClick={() => useCalcStore.getState().inputParenthesis('(')} variant="function" />
        <CalcButton label=")" onClick={() => useCalcStore.getState().inputParenthesis(')')} variant="function" />
        <CalcButton label="÷" onClick={() => inputOperator('÷')} variant="operator" />

        <CalcButton label="7" onClick={() => inputDigit('7')} />
        <CalcButton label="8" onClick={() => inputDigit('8')} />
        <CalcButton label="9" onClick={() => inputDigit('9')} />
        <CalcButton label="×" onClick={() => inputOperator('×')} variant="operator" />

        <CalcButton label="4" onClick={() => inputDigit('4')} />
        <CalcButton label="5" onClick={() => inputDigit('5')} />
        <CalcButton label="6" onClick={() => inputDigit('6')} />
        <CalcButton label="−" onClick={() => inputOperator('−')} variant="operator" />

        <CalcButton label="1" onClick={() => inputDigit('1')} />
        <CalcButton label="2" onClick={() => inputDigit('2')} />
        <CalcButton label="3" onClick={() => inputDigit('3')} />
        <CalcButton label="+" onClick={() => inputOperator('+')} variant="operator" />

        <CalcButton label="0" onClick={() => inputDigit('0')} />
        <CalcButton label="." onClick={() => inputDigit('.')} />
        <CalcButton label="⌫" onClick={backspace} variant="function" />
        <CalcButton label="=" onClick={evaluate} variant="equals" />
      </div>
    </div>
  );
}
