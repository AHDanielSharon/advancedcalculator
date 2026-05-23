import { useState } from 'react';
import { useCalcStore, THEMES } from '@/store/calculatorStore';
import * as math from 'mathjs';

export default function MatrixKeypad() {
  const { theme } = useCalcStore();
  const colors = THEMES[theme];

  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matA, setMatA] = useState<number[][]>([[1, 0], [0, 1]]);
  const [matB, setMatB] = useState<number[][]>([[1, 0], [0, 1]]);
  const [result, setResult] = useState<string>('');
  const [activeMatrix, setActiveMatrix] = useState<'A' | 'B'>('A');
  const [editCell, setEditCell] = useState<{ r: number; c: number } | null>(null);
  const [cellInput, setCellInput] = useState('');

  const updateSize = (r: number, c: number) => {
    setRows(r);
    setCols(c);
    const resize = (mat: number[][]) => {
      const newMat: number[][] = [];
      for (let i = 0; i < r; i++) {
        newMat[i] = [];
        for (let j = 0; j < c; j++) {
          newMat[i][j] = mat[i]?.[j] ?? 0;
        }
      }
      return newMat;
    };
    setMatA(resize(matA));
    setMatB(resize(matB));
  };

  const handleCellClick = (r: number, c: number) => {
    setEditCell({ r, c });
    const mat = activeMatrix === 'A' ? matA : matB;
    setCellInput(mat[r][c].toString());
  };

  const handleCellSave = () => {
    if (!editCell) return;
    const val = parseFloat(cellInput) || 0;
    if (activeMatrix === 'A') {
      const newMat = matA.map(row => [...row]);
      newMat[editCell.r][editCell.c] = val;
      setMatA(newMat);
    } else {
      const newMat = matB.map(row => [...row]);
      newMat[editCell.r][editCell.c] = val;
      setMatB(newMat);
    }
    setEditCell(null);
    setCellInput('');
  };

  const compute = (op: string) => {
    try {
      const a = math.matrix(matA);
      const b = math.matrix(matB);
      let res: any;
      switch (op) {
        case 'A+B': res = math.add(a, b); break;
        case 'A-B': res = math.subtract(a, b); break;
        case 'A×B': res = math.multiply(a, b); break;
        case 'det(A)': res = math.det(a); break;
        case 'det(B)': res = math.det(b); break;
        case 'inv(A)': res = math.inv(a); break;
        case 'inv(B)': res = math.inv(b); break;
        case 'Aᵀ': res = math.transpose(a); break;
        case 'Bᵀ': res = math.transpose(b); break;
        default: return;
      }
      setResult(math.format(res, { precision: 6 }));
    } catch (e: any) {
      setResult('Error: ' + (e.message || 'Invalid operation'));
    }
  };

  const currentMat = activeMatrix === 'A' ? matA : matB;

  return (
    <div className="flex flex-col gap-2 px-3 pb-2">
      {/* Matrix tabs and size */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {(['A', 'B'] as const).map(m => (
            <button
              key={m}
              onClick={() => setActiveMatrix(m)}
              className="text-xs font-mono px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: activeMatrix === m ? `rgba(${colors.primaryRgb}, 0.15)` : 'rgba(255,255,255,0.03)',
                color: activeMatrix === m ? colors.primary : 'rgba(255,255,255,0.4)',
                border: `1px solid ${activeMatrix === m ? `rgba(${colors.primaryRgb}, 0.2)` : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              Matrix {m}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <select value={rows} onChange={e => updateSize(Number(e.target.value), cols)}
            className="bg-transparent text-xs font-mono px-1 py-0.5 rounded outline-none"
            style={{ color: colors.primary, border: `1px solid rgba(${colors.primaryRgb}, 0.2)` }}>
            {[2, 3, 4].map(n => <option key={n} value={n} className="bg-gray-900">{n}</option>)}
          </select>
          <span className="text-xs text-white/30">×</span>
          <select value={cols} onChange={e => updateSize(rows, Number(e.target.value))}
            className="bg-transparent text-xs font-mono px-1 py-0.5 rounded outline-none"
            style={{ color: colors.primary, border: `1px solid rgba(${colors.primaryRgb}, 0.2)` }}>
            {[2, 3, 4].map(n => <option key={n} value={n} className="bg-gray-900">{n}</option>)}
          </select>
        </div>
      </div>

      {/* Matrix grid */}
      <div className="glass rounded-xl p-2">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {currentMat.map((row, r) =>
            row.map((val, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className="text-center py-2 rounded-lg text-sm font-mono transition-colors active:scale-95"
                style={{
                  background: editCell?.r === r && editCell?.c === c
                    ? `rgba(${colors.primaryRgb}, 0.2)`
                    : 'rgba(255,255,255,0.03)',
                  color: editCell?.r === r && editCell?.c === c ? colors.primary : '#fff',
                  border: `1px solid ${editCell?.r === r && editCell?.c === c
                    ? `rgba(${colors.primaryRgb}, 0.3)` : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                {val}
              </button>
            ))
          )}
        </div>
        {editCell && (
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              value={cellInput}
              onChange={e => setCellInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCellSave()}
              className="flex-1 bg-transparent text-sm font-mono px-3 py-1.5 rounded-lg outline-none"
              style={{
                border: `1px solid rgba(${colors.primaryRgb}, 0.3)`,
                color: '#fff',
              }}
              autoFocus
            />
            <button
              onClick={handleCellSave}
              className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: colors.primary, color: '#000' }}
            >
              Set
            </button>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="glass rounded-xl p-2">
          <div className="text-[10px] font-mono text-white/30 mb-1">Result:</div>
          <div className="text-sm font-mono break-all" style={{ color: colors.primary }}>
            {result}
          </div>
        </div>
      )}

      {/* Operations */}
      <div className="grid grid-cols-3 gap-[5px]">
        {['A+B', 'A-B', 'A×B', 'det(A)', 'det(B)', 'inv(A)', 'inv(B)', 'Aᵀ', 'Bᵀ'].map(op => (
          <button
            key={op}
            onClick={() => compute(op)}
            className="py-2.5 rounded-xl text-xs font-mono font-bold active:scale-95 transition-transform"
            style={{
              background: `rgba(${colors.primaryRgb}, 0.1)`,
              color: colors.primary,
              border: `1px solid rgba(${colors.primaryRgb}, 0.15)`,
            }}
          >
            {op}
          </button>
        ))}
      </div>
    </div>
  );
}
