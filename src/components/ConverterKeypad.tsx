import { useState, useMemo } from 'react';
import CalcButton from './CalcButton';
import { useCalcStore, THEMES } from '@/store/calculatorStore';

interface UnitCategory {
  name: string;
  icon: string;
  units: { name: string; abbr: string; toBase: (v: number) => number; fromBase: (v: number) => number }[];
}

const UNIT_CATEGORIES: UnitCategory[] = [
  {
    name: 'Length', icon: '📏',
    units: [
      { name: 'Meters', abbr: 'm', toBase: v => v, fromBase: v => v },
      { name: 'Kilometers', abbr: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { name: 'Centimeters', abbr: 'cm', toBase: v => v / 100, fromBase: v => v * 100 },
      { name: 'Millimeters', abbr: 'mm', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { name: 'Miles', abbr: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { name: 'Feet', abbr: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { name: 'Inches', abbr: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { name: 'Yards', abbr: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    ]
  },
  {
    name: 'Weight', icon: '⚖️',
    units: [
      { name: 'Kilograms', abbr: 'kg', toBase: v => v, fromBase: v => v },
      { name: 'Grams', abbr: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { name: 'Milligrams', abbr: 'mg', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      { name: 'Pounds', abbr: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { name: 'Ounces', abbr: 'oz', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { name: 'Tonnes', abbr: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
    ]
  },
  {
    name: 'Temperature', icon: '🌡️',
    units: [
      { name: 'Celsius', abbr: '°C', toBase: v => v, fromBase: v => v },
      { name: 'Fahrenheit', abbr: '°F', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
      { name: 'Kelvin', abbr: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ]
  },
  {
    name: 'Time', icon: '⏱️',
    units: [
      { name: 'Seconds', abbr: 's', toBase: v => v, fromBase: v => v },
      { name: 'Minutes', abbr: 'min', toBase: v => v * 60, fromBase: v => v / 60 },
      { name: 'Hours', abbr: 'hr', toBase: v => v * 3600, fromBase: v => v / 3600 },
      { name: 'Days', abbr: 'd', toBase: v => v * 86400, fromBase: v => v / 86400 },
      { name: 'Weeks', abbr: 'wk', toBase: v => v * 604800, fromBase: v => v / 604800 },
      { name: 'Years', abbr: 'yr', toBase: v => v * 31557600, fromBase: v => v / 31557600 },
    ]
  },
  {
    name: 'Data', icon: '💾',
    units: [
      { name: 'Bytes', abbr: 'B', toBase: v => v, fromBase: v => v },
      { name: 'Kilobytes', abbr: 'KB', toBase: v => v * 1024, fromBase: v => v / 1024 },
      { name: 'Megabytes', abbr: 'MB', toBase: v => v * 1048576, fromBase: v => v / 1048576 },
      { name: 'Gigabytes', abbr: 'GB', toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
      { name: 'Terabytes', abbr: 'TB', toBase: v => v * 1099511627776, fromBase: v => v / 1099511627776 },
    ]
  },
  {
    name: 'Speed', icon: '🏎️',
    units: [
      { name: 'Meters/s', abbr: 'm/s', toBase: v => v, fromBase: v => v },
      { name: 'Kilometers/h', abbr: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { name: 'Miles/h', abbr: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { name: 'Knots', abbr: 'kn', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    ]
  },
];

export default function ConverterKeypad() {
  const { theme } = useCalcStore();
  const colors = THEMES[theme];
  const [catIdx, setCatIdx] = useState(0);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [value, setValue] = useState('1');

  const cat = UNIT_CATEGORIES[catIdx];

  const result = useMemo(() => {
    const v = parseFloat(value) || 0;
    const base = cat.units[fromIdx].toBase(v);
    const converted = cat.units[toIdx].fromBase(base);
    return converted;
  }, [value, catIdx, fromIdx, toIdx, cat]);

  const inputDigit = (d: string) => {
    if (value === '0' && d !== '.') setValue(d);
    else if (d === '.' && value.includes('.')) return;
    else setValue(value + d);
  };

  const backspace = () => {
    if (value.length <= 1) setValue('0');
    else setValue(value.slice(0, -1));
  };

  const swap = () => {
    const temp = fromIdx;
    setFromIdx(toIdx);
    setToIdx(temp);
  };

  return (
    <div className="flex flex-col gap-2 px-3 pb-2">
      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {UNIT_CATEGORIES.map((c, i) => (
          <button
            key={c.name}
            onClick={() => { setCatIdx(i); setFromIdx(0); setToIdx(1); setValue('1'); }}
            className="flex-shrink-0 text-xs font-mono px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors"
            style={{
              background: catIdx === i ? `rgba(${colors.primaryRgb}, 0.15)` : 'rgba(255,255,255,0.03)',
              color: catIdx === i ? colors.primary : 'rgba(255,255,255,0.4)',
              border: `1px solid ${catIdx === i ? `rgba(${colors.primaryRgb}, 0.2)` : 'rgba(255,255,255,0.05)'}`,
            }}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Conversion display */}
      <div className="glass rounded-xl p-3 space-y-2">
        {/* From */}
        <div className="flex items-center justify-between">
          <select
            value={fromIdx}
            onChange={e => setFromIdx(Number(e.target.value))}
            className="bg-transparent text-xs font-mono outline-none"
            style={{ color: colors.primary }}
          >
            {cat.units.map((u, i) => (
              <option key={i} value={i} className="bg-gray-900">{u.name} ({u.abbr})</option>
            ))}
          </select>
          <span className="text-lg font-mono font-bold text-white">{value}</span>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={swap}
            className="text-lg p-1 rounded-full active:scale-90 transition-transform"
            style={{ color: colors.primary }}
          >
            ⇅
          </button>
        </div>

        {/* To */}
        <div className="flex items-center justify-between">
          <select
            value={toIdx}
            onChange={e => setToIdx(Number(e.target.value))}
            className="bg-transparent text-xs font-mono outline-none"
            style={{ color: colors.primary }}
          >
            {cat.units.map((u, i) => (
              <option key={i} value={i} className="bg-gray-900">{u.name} ({u.abbr})</option>
            ))}
          </select>
          <span
            className="text-lg font-mono font-bold"
            style={{ color: colors.primary }}
          >
            {result.toPrecision(8).replace(/\.?0+$/, '')}
          </span>
        </div>
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-4 gap-[6px]">
        <CalcButton label="7" onClick={() => inputDigit('7')} />
        <CalcButton label="8" onClick={() => inputDigit('8')} />
        <CalcButton label="9" onClick={() => inputDigit('9')} />
        <CalcButton label="⌫" onClick={backspace} variant="function" />

        <CalcButton label="4" onClick={() => inputDigit('4')} />
        <CalcButton label="5" onClick={() => inputDigit('5')} />
        <CalcButton label="6" onClick={() => inputDigit('6')} />
        <CalcButton label="AC" onClick={() => setValue('0')} variant="action" />

        <CalcButton label="1" onClick={() => inputDigit('1')} />
        <CalcButton label="2" onClick={() => inputDigit('2')} />
        <CalcButton label="3" onClick={() => inputDigit('3')} />
        <CalcButton label="⇅" onClick={swap} variant="operator" />

        <CalcButton label="0" onClick={() => inputDigit('0')} span={2} />
        <CalcButton label="." onClick={() => inputDigit('.')} />
        <CalcButton label="00" onClick={() => { inputDigit('0'); inputDigit('0'); }} variant="function" />
      </div>
    </div>
  );
}
