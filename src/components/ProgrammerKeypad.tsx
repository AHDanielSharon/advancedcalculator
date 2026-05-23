import CalcButton from './CalcButton';
import { useCalcStore, THEMES } from '@/store/calculatorStore';

export default function ProgrammerKeypad() {
  const {
    inputDigit, inputOperator, clear, backspace,
    evaluate, display, programmerBase, setProgrammerBase, theme,
  } = useCalcStore();
  const colors = THEMES[theme];

  const currentVal = parseInt(display) || 0;

  const conversions = {
    bin: (currentVal >>> 0).toString(2),
    oct: (currentVal >>> 0).toString(8),
    dec: currentVal.toString(10),
    hex: (currentVal >>> 0).toString(16).toUpperCase(),
  };

  const isHexDigit = programmerBase === 16;

  return (
    <div className="flex flex-col gap-[5px] px-2 pb-2">
      {/* Base display */}
      <div className="glass rounded-xl p-2 mx-1 space-y-1">
        {(['hex', 'dec', 'oct', 'bin'] as const).map(base => {
          const baseNum = base === 'hex' ? 16 : base === 'dec' ? 10 : base === 'oct' ? 8 : 2;
          const isActive = programmerBase === baseNum;
          return (
            <button
              key={base}
              onClick={() => setProgrammerBase(baseNum as 2|8|10|16)}
              className="w-full flex items-center gap-3 px-2 py-1 rounded-lg transition-colors"
              style={{
                background: isActive ? `rgba(${colors.primaryRgb}, 0.1)` : 'transparent',
              }}
            >
              <span
                className="text-[10px] font-mono font-bold w-8 uppercase"
                style={{ color: isActive ? colors.primary : 'rgba(255,255,255,0.4)' }}
              >
                {base}
              </span>
              <span
                className="text-xs font-mono truncate"
                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.3)' }}
              >
                {conversions[base]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bitwise ops */}
      <div className="grid grid-cols-4 gap-[5px]">
        <CalcButton label="AND" onClick={() => inputOperator('&')} variant="function" />
        <CalcButton label="OR" onClick={() => inputOperator('|')} variant="function" />
        <CalcButton label="XOR" onClick={() => inputOperator('^')} variant="function" />
        <CalcButton label="NOT" onClick={() => {
          const val = parseInt(display) || 0;
          useCalcStore.getState().clear();
          inputDigit((~val).toString());
        }} variant="function" />
      </div>

      <div className="grid grid-cols-4 gap-[5px]">
        <CalcButton label="<<" onClick={() => inputOperator('<<')} variant="function" />
        <CalcButton label=">>" onClick={() => inputOperator('>>')} variant="function" />
        <CalcButton label="AC" onClick={clear} variant="action" />
        <CalcButton label="⌫" onClick={backspace} variant="function" />
      </div>

      {/* Hex digits + numbers */}
      <div className="grid grid-cols-4 gap-[5px]">
        <CalcButton label="A" onClick={() => inputDigit('A')} variant="function"
          className={!isHexDigit ? 'opacity-30 pointer-events-none' : ''} />
        <CalcButton label="B" onClick={() => inputDigit('B')} variant="function"
          className={!isHexDigit ? 'opacity-30 pointer-events-none' : ''} />
        <CalcButton label="C" onClick={() => inputDigit('C')} variant="function"
          className={!isHexDigit ? 'opacity-30 pointer-events-none' : ''} />
        <CalcButton label="÷" onClick={() => inputOperator('÷')} variant="operator" />
      </div>

      <div className="grid grid-cols-4 gap-[5px]">
        <CalcButton label="D" onClick={() => inputDigit('D')} variant="function"
          className={!isHexDigit ? 'opacity-30 pointer-events-none' : ''} />
        <CalcButton label="E" onClick={() => inputDigit('E')} variant="function"
          className={!isHexDigit ? 'opacity-30 pointer-events-none' : ''} />
        <CalcButton label="F" onClick={() => inputDigit('F')} variant="function"
          className={!isHexDigit ? 'opacity-30 pointer-events-none' : ''} />
        <CalcButton label="×" onClick={() => inputOperator('×')} variant="operator" />
      </div>

      <div className="grid grid-cols-4 gap-[5px]">
        <CalcButton label="7" onClick={() => inputDigit('7')}
          className={programmerBase < 8 ? 'opacity-30 pointer-events-none' : ''} />
        <CalcButton label="8" onClick={() => inputDigit('8')}
          className={programmerBase < 10 ? 'opacity-30 pointer-events-none' : ''} />
        <CalcButton label="9" onClick={() => inputDigit('9')}
          className={programmerBase < 10 ? 'opacity-30 pointer-events-none' : ''} />
        <CalcButton label="−" onClick={() => inputOperator('−')} variant="operator" />
      </div>

      <div className="grid grid-cols-4 gap-[5px]">
        <CalcButton label="4" onClick={() => inputDigit('4')}
          className={programmerBase < 8 ? 'opacity-30 pointer-events-none' : ''} />
        <CalcButton label="5" onClick={() => inputDigit('5')}
          className={programmerBase < 8 ? 'opacity-30 pointer-events-none' : ''} />
        <CalcButton label="6" onClick={() => inputDigit('6')}
          className={programmerBase < 8 ? 'opacity-30 pointer-events-none' : ''} />
        <CalcButton label="+" onClick={() => inputOperator('+')} variant="operator" />
      </div>

      <div className="grid grid-cols-4 gap-[5px]">
        <CalcButton label="1" onClick={() => inputDigit('1')} />
        <CalcButton label="0" onClick={() => inputDigit('0')} />
        <CalcButton label="00" onClick={() => { inputDigit('0'); inputDigit('0'); }} />
        <CalcButton label="=" onClick={evaluate} variant="equals" />
      </div>
    </div>
  );
}
