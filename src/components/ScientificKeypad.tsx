import CalcButton from './CalcButton';
import { useCalcStore } from '@/store/calculatorStore';

export default function ScientificKeypad() {
  const {
    inputDigit, inputOperator, clear, backspace,
    evaluate, toggleSign, percentage,
    inputFunction, inputConstant, inputParenthesis,
    isInverse, toggleInverse, angleMode, setAngleMode, factorial,
  } = useCalcStore();

  return (
    <div className="flex flex-col gap-[5px] px-2 pb-2">
      {/* Top function row */}
      <div className="grid grid-cols-5 gap-[5px]">
        <CalcButton
          label={angleMode === 'deg' ? 'DEG' : 'RAD'}
          onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
          variant="memory"
        />
        <CalcButton label="INV" onClick={toggleInverse} variant="memory"
          className={isInverse ? '!border-[rgba(0,212,255,0.4)]' : ''}
        />
        <CalcButton label="(" onClick={() => inputParenthesis('(')} variant="function" />
        <CalcButton label=")" onClick={() => inputParenthesis(')')} variant="function" />
        <CalcButton label="⌫" onClick={backspace} variant="function" onLongPress={clear} />
      </div>

      {/* Scientific functions */}
      <div className="grid grid-cols-5 gap-[5px]">
        <CalcButton
          label={isInverse ? 'sin⁻¹' : 'sin'}
          onClick={() => inputFunction(isInverse ? 'asin' : 'sin')}
          variant="function"
        />
        <CalcButton
          label={isInverse ? 'cos⁻¹' : 'cos'}
          onClick={() => inputFunction(isInverse ? 'acos' : 'cos')}
          variant="function"
        />
        <CalcButton
          label={isInverse ? 'tan⁻¹' : 'tan'}
          onClick={() => inputFunction(isInverse ? 'atan' : 'tan')}
          variant="function"
        />
        <CalcButton label="π" onClick={() => inputConstant('π')} variant="function" />
        <CalcButton label="e" onClick={() => inputConstant('e')} variant="function" />
      </div>

      <div className="grid grid-cols-5 gap-[5px]">
        <CalcButton
          label={isInverse ? '10ˣ' : 'log'}
          onClick={() => inputFunction(isInverse ? '10ˣ' : 'log10')}
          variant="function"
        />
        <CalcButton
          label={isInverse ? 'eˣ' : 'ln'}
          onClick={() => inputFunction(isInverse ? 'eˣ' : 'ln')}
          variant="function"
        />
        <CalcButton label="x!" onClick={factorial} variant="function" />
        <CalcButton label="xʸ" onClick={() => inputOperator('^')} variant="function" />
        <CalcButton
          label={isInverse ? 'x³' : 'x²'}
          onClick={() => inputFunction(isInverse ? 'x³' : 'x²')}
          variant="function"
        />
      </div>

      <div className="grid grid-cols-5 gap-[5px]">
        <CalcButton label="√" onClick={() => inputFunction('√')} variant="function" />
        <CalcButton label="∛" onClick={() => inputFunction('∛')} variant="function" />
        <CalcButton label="1/x" onClick={() => inputFunction('1/x')} variant="function" />
        <CalcButton label="|x|" onClick={() => inputFunction('abs')} variant="function" />
        <CalcButton label="÷" onClick={() => inputOperator('÷')} variant="operator" />
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-5 gap-[5px]">
        <CalcButton label="AC" onClick={clear} variant="action" />
        <CalcButton label="7" onClick={() => inputDigit('7')} />
        <CalcButton label="8" onClick={() => inputDigit('8')} />
        <CalcButton label="9" onClick={() => inputDigit('9')} />
        <CalcButton label="×" onClick={() => inputOperator('×')} variant="operator" />
      </div>

      <div className="grid grid-cols-5 gap-[5px]">
        <CalcButton label="%" onClick={percentage} variant="function" />
        <CalcButton label="4" onClick={() => inputDigit('4')} />
        <CalcButton label="5" onClick={() => inputDigit('5')} />
        <CalcButton label="6" onClick={() => inputDigit('6')} />
        <CalcButton label="−" onClick={() => inputOperator('−')} variant="operator" />
      </div>

      <div className="grid grid-cols-5 gap-[5px]">
        <CalcButton label="±" onClick={toggleSign} variant="function" />
        <CalcButton label="1" onClick={() => inputDigit('1')} />
        <CalcButton label="2" onClick={() => inputDigit('2')} />
        <CalcButton label="3" onClick={() => inputDigit('3')} />
        <CalcButton label="+" onClick={() => inputOperator('+')} variant="operator" />
      </div>

      <div className="grid grid-cols-5 gap-[5px]">
        <CalcButton label="φ" onClick={() => inputConstant('φ')} variant="function" />
        <CalcButton label="0" onClick={() => inputDigit('0')} />
        <CalcButton label="." onClick={() => inputDigit('.')} />
        <CalcButton label="EXP" onClick={() => inputOperator('e+')} variant="function" />
        <CalcButton label="=" onClick={evaluate} variant="equals" />
      </div>
    </div>
  );
}
