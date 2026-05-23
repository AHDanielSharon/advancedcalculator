import { useState, useMemo } from 'react';
import CalcButton from './CalcButton';
import { useCalcStore, THEMES } from '@/store/calculatorStore';
export default function StatisticsKeypad() {
  const { theme } = useCalcStore();
  const colors = THEMES[theme];
  const [dataset, setDataset] = useState<number[]>([]);
  const [currentVal, setCurrentVal] = useState('0');

  const stats = useMemo(() => {
    if (dataset.length === 0) return null;
    const sorted = [...dataset].sort((a, b) => a - b);
    const n = dataset.length;
    const sum = dataset.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const variance = dataset.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
    const stdDev = Math.sqrt(variance);
    const median = n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    // Mode
    const freq: Record<number, number> = {};
    dataset.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq).filter(([, f]) => f === maxFreq).map(([v]) => Number(v));

    return { n, sum, mean, median, variance, stdDev, min, max, range, modes, sorted };
  }, [dataset]);

  const addValue = () => {
    const v = parseFloat(currentVal);
    if (!isNaN(v)) {
      setDataset(prev => [...prev, v]);
      setCurrentVal('0');
    }
  };

  const inputDigit = (d: string) => {
    if (currentVal === '0' && d !== '.') setCurrentVal(d);
    else if (d === '.' && currentVal.includes('.')) return;
    else setCurrentVal(currentVal + d);
  };

  const clearData = () => {
    setDataset([]);
    setCurrentVal('0');
  };

  const formatNum = (n: number) => {
    if (Number.isInteger(n) && Math.abs(n) < 1e12) return n.toString();
    return n.toPrecision(6).replace(/\.?0+$/, '');
  };

  return (
    <div className="flex flex-col gap-2 px-3 pb-2">
      {/* Data display */}
      <div className="glass rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-white/40">Data Points: {dataset.length}</span>
          <button onClick={clearData} className="text-[10px] font-mono text-red-400 px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,100,100,0.1)' }}>
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto mb-2">
          {dataset.map((v, i) => (
            <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: `rgba(${colors.primaryRgb}, 0.1)`, color: colors.primary }}>
              {v}
            </span>
          ))}
          {dataset.length === 0 && (
            <span className="text-[10px] font-mono text-white/20">Enter values and tap ADD</span>
          )}
        </div>

        {/* Current input */}
        <div className="text-right text-xl font-mono font-bold" style={{ color: colors.primary }}>
          {currentVal}
        </div>
      </div>

      {/* Stats results */}
      {stats && (
        <div className="glass rounded-xl p-2">
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: 'Mean', value: formatNum(stats.mean) },
              { label: 'Median', value: formatNum(stats.median) },
              { label: 'Std Dev', value: formatNum(stats.stdDev) },
              { label: 'Min', value: formatNum(stats.min) },
              { label: 'Max', value: formatNum(stats.max) },
              { label: 'Sum', value: formatNum(stats.sum) },
              { label: 'Variance', value: formatNum(stats.variance) },
              { label: 'Range', value: formatNum(stats.range) },
              { label: 'Count', value: stats.n.toString() },
            ].map(s => (
              <div key={s.label} className="text-center p-1">
                <div className="text-[9px] font-mono text-white/30">{s.label}</div>
                <div className="text-xs font-mono font-bold" style={{ color: colors.primary }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-[6px]">
        <CalcButton label="7" onClick={() => inputDigit('7')} />
        <CalcButton label="8" onClick={() => inputDigit('8')} />
        <CalcButton label="9" onClick={() => inputDigit('9')} />
        <CalcButton label="ADD" onClick={addValue} variant="operator" />

        <CalcButton label="4" onClick={() => inputDigit('4')} />
        <CalcButton label="5" onClick={() => inputDigit('5')} />
        <CalcButton label="6" onClick={() => inputDigit('6')} />
        <CalcButton label="⌫" onClick={() => {
          if (currentVal.length <= 1) setCurrentVal('0');
          else setCurrentVal(currentVal.slice(0, -1));
        }} variant="function" />

        <CalcButton label="1" onClick={() => inputDigit('1')} />
        <CalcButton label="2" onClick={() => inputDigit('2')} />
        <CalcButton label="3" onClick={() => inputDigit('3')} />
        <CalcButton label="±" onClick={() => {
          if (currentVal.startsWith('-')) setCurrentVal(currentVal.slice(1));
          else if (currentVal !== '0') setCurrentVal('-' + currentVal);
        }} variant="function" />

        <CalcButton label="0" onClick={() => inputDigit('0')} />
        <CalcButton label="." onClick={() => inputDigit('.')} />
        <CalcButton label="AC" onClick={clearData} variant="action" />
        <CalcButton label="DEL" onClick={() => {
          setDataset(prev => prev.slice(0, -1));
        }} variant="function" />
      </div>
    </div>
  );
}
