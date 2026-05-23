import CalcButton from './CalcButton';
import { useCalcStore } from '@/store/calculatorStore';

export default function StandardKeypad() {
  const {
    inputDigit, inputOperator, clear, backspace,
    evaluate, toggleSign, percentage,
    memoryRecall, memoryClear, memoryAdd, memorySubtract, memoryStore,
  } = useCalcStore();

  return (
    <div className="flex flex-col gap-[6px] px-3 pb-2">
      {/* Memory row */}
      <div className="grid grid-cols-5 gap-[6px]">
        <CalcButton label="MC" onClick={memoryClear} variant="memory" />
        <CalcButton label="MR" onClick={memoryRecall} variant="memory" />
        <CalcButton label="M+" onClick={memoryAdd} variant="memory" />
        <CalcButton label="M-" onClick={memorySubtract} variant="memory" />
        <CalcButton label="MS" onClick={memoryStore} variant="memory" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-4 gap-[6px]">
        <CalcButton label="AC" onClick={clear} variant="action" />
        <CalcButton label="±" onClick={toggleSign} variant="function" />
        <CalcButton label="%" onClick={percentage} variant="function" />
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

        <CalcButton
          label="0"
          onClick={() => inputDigit('0')}
          span={1}
        />
        <CalcButton label="." onClick={() => inputDigit('.')} />
        <CalcButton label="⌫" onClick={backspace} variant="function"
          onLongPress={clear}
        />
        <CalcButton label="=" onClick={evaluate} variant="equals" />
      </div>
    </div>
  );
}
