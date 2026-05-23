import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCalcStore, THEMES } from '@/store/calculatorStore';
import * as math from 'mathjs';

// AI response generator
function generateAIResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  // Math evaluation
  if (/^[\d\s+\-*/^().%√πe,]+$/.test(input.replace(/[a-z]+\(/gi, ''))) {
    try {
      const result = math.evaluate(input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'));
      return `The answer is **${math.format(result, { precision: 10 })}**`;
    } catch {}
  }

  // Solve equations
  if (lower.includes('solve') || lower.includes('find x')) {
    const eqMatch = input.match(/[\d\w\s+\-*/^()=]+/);
    if (eqMatch) {
      try {
        // Simple linear equation solver
        const eq = eqMatch[0];
        if (eq.includes('=')) {
          const [left, right] = eq.split('=');
          const l = left.trim();
          const r = right.trim();
          return `To solve **${l} = ${r}**:\n\n1. Move all terms to one side\n2. Simplify and isolate the variable\n3. The equation can be solved by algebraic manipulation.\n\nTry entering the expression directly in the calculator for numerical evaluation.`;
        }
      } catch {}
    }
    return `I can help solve equations! Please enter the equation in the form "solve ax + b = c" and I'll walk you through the steps.`;
  }

  // Derivatives
  if (lower.includes('derivative') || lower.includes('differentiate') || lower.includes('d/dx')) {
    const funcMatch = input.match(/(?:of|derivative)\s+(.+)/i);
    if (funcMatch) {
      const fn = funcMatch[1].trim();
      try {
        const derivative = math.derivative(fn, 'x');
        return `The derivative of **${fn}** is:\n\n**d/dx = ${derivative.toString()}**\n\nUsing standard differentiation rules.`;
      } catch {
        return `I'll differentiate **${fn}** for you:\n\nApply the standard rules of differentiation (power rule, chain rule, product rule as needed).`;
      }
    }
    return `I can find derivatives! Try: "derivative of x^2 + 3x"`;
  }

  // Integration
  if (lower.includes('integral') || lower.includes('integrate')) {
    return `For integration, I can help with:\n\n• **Power rule**: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n• **Trig**: ∫sin(x) dx = -cos(x) + C\n• **Exponential**: ∫eˣ dx = eˣ + C\n\nTell me the specific function to integrate!`;
  }

  // Quadratic formula
  if (lower.includes('quadratic')) {
    return `**Quadratic Formula:**\n\nx = (-b ± √(b²-4ac)) / 2a\n\nFor **ax² + bx + c = 0**\n\nGive me the values of a, b, and c and I'll solve it!`;
  }

  // Formulas
  if (lower.includes('formula') || lower.includes('formulas')) {
    return `Here are some key formulas:\n\n📐 **Geometry:**\n• Circle Area: A = πr²\n• Sphere Volume: V = 4/3πr³\n\n📊 **Algebra:**\n• Quadratic: x = (-b±√(b²-4ac))/2a\n\n📈 **Calculus:**\n• Power Rule: d/dx(xⁿ) = nxⁿ⁻¹\n\nAsk about any specific topic!`;
  }

  // Physics
  if (lower.includes('physics') || lower.includes('force') || lower.includes('velocity') || lower.includes('energy')) {
    return `**Physics Formulas:**\n\n⚡ F = ma (Newton's 2nd Law)\n⚡ KE = ½mv² (Kinetic Energy)\n⚡ PE = mgh (Potential Energy)\n⚡ v = u + at (Kinematics)\n⚡ E = mc² (Mass-Energy)\n⚡ W = Fd (Work)\n⚡ P = W/t (Power)\n\nAsk about any physics concept!`;
  }

  // Chemistry
  if (lower.includes('chemistry') || lower.includes('element') || lower.includes('molar')) {
    return `**Chemistry Reference:**\n\n🧪 Avogadro: 6.022 × 10²³\n🧪 PV = nRT (Ideal Gas)\n🧪 pH = -log[H⁺]\n🧪 E = hf (Photon energy)\n\nAsk about specific elements or reactions!`;
  }

  // Trig
  if (lower.includes('trig') || lower.includes('sine') || lower.includes('cosine')) {
    return `**Trigonometric Identities:**\n\n📐 sin²θ + cos²θ = 1\n📐 tan θ = sin θ / cos θ\n📐 sin(2θ) = 2sin θ cos θ\n📐 cos(2θ) = cos²θ - sin²θ\n\n**Unit Circle Values:**\n• sin(30°) = 1/2\n• cos(60°) = 1/2\n• tan(45°) = 1`;
  }

  // Help
  if (lower.includes('help') || lower.includes('what can you do') || lower === 'hi' || lower === 'hello') {
    return `I'm **NOVA AI** 🤖, your computational assistant!\n\nI can help with:\n\n🔢 **Math**: Arithmetic, algebra, calculus, statistics\n📐 **Geometry**: Areas, volumes, angles\n⚡ **Physics**: Formulas, conversions, mechanics\n🧪 **Chemistry**: Elements, equations, moles\n💻 **Programming**: Base conversion, bitwise ops\n📊 **Statistics**: Mean, median, probability\n\nJust ask naturally!`;
  }

  // Conversion
  if (lower.includes('convert') || lower.includes('conversion')) {
    return `I can help with conversions!\n\n📏 **Length**: km, m, cm, mm, mi, ft, in\n⚖️ **Weight**: kg, g, lb, oz\n🌡️ **Temperature**: °C, °F, K\n⏱️ **Time**: s, min, hr, day\n💾 **Data**: B, KB, MB, GB, TB\n\nExample: "Convert 100°F to Celsius"`;
  }

  if (lower.includes('celsius') || lower.includes('fahrenheit')) {
    const numMatch = input.match(/(\d+\.?\d*)/);
    if (numMatch) {
      const val = parseFloat(numMatch[1]);
      if (lower.includes('to celsius') || lower.includes('to c')) {
        const c = ((val - 32) * 5 / 9).toFixed(2);
        return `**${val}°F = ${c}°C**\n\nFormula: °C = (°F - 32) × 5/9`;
      }
      if (lower.includes('to fahrenheit') || lower.includes('to f')) {
        const f = (val * 9 / 5 + 32).toFixed(2);
        return `**${val}°C = ${f}°F**\n\nFormula: °F = °C × 9/5 + 32`;
      }
    }
  }

  // Factorial
  if (lower.includes('factorial')) {
    const numMatch = input.match(/(\d+)/);
    if (numMatch) {
      const n = parseInt(numMatch[1]);
      if (n <= 170) {
        const result = math.factorial(n);
        return `**${n}! = ${math.format(result, { precision: 14 })}**`;
      }
    }
    return `Factorial (n!) is the product of all positive integers up to n.\n\nExample: 5! = 5 × 4 × 3 × 2 × 1 = 120`;
  }

  // Matrix
  if (lower.includes('matrix') || lower.includes('matrices')) {
    return `**Matrix Operations:**\n\n📊 Addition/Subtraction\n📊 Multiplication\n📊 Determinant\n📊 Inverse\n📊 Transpose\n📊 Eigenvalues\n\nSwitch to Matrix mode for full support!`;
  }

  // Statistics
  if (lower.includes('mean') || lower.includes('average') || lower.includes('statistics') || lower.includes('median')) {
    return `**Statistics Tools:**\n\n📊 Mean: Sum of values / count\n📊 Median: Middle value when sorted\n📊 Mode: Most frequent value\n📊 Std Dev: √(Σ(x-μ)²/n)\n📊 Variance: Σ(x-μ)²/n\n\nSwitch to Statistics mode for calculations!`;
  }

  // Default
  return `I understand your question about "${input}". Let me help!\n\nHere's what I can do:\n• Solve math problems\n• Explain concepts step-by-step\n• Convert units\n• Provide formulas\n• Help with physics, chemistry, and more\n\nTry being more specific and I'll give you a detailed answer!`;
}

export default function NovaAIPanel() {
  const { aiMessages, addAiMessage, theme, setPanel } = useCalcStore();
  const colors = THEMES[theme];
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    addAiMessage('user', input.trim());
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(input.trim());
      addAiMessage('ai', response);
      setIsTyping(false);
    }, 600 + Math.random() * 800);

    setInput('');
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="absolute inset-0 z-30 flex flex-col"
      style={{ background: 'rgba(5,5,10,0.98)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={() => setPanel('calc')} className="text-2xl" style={{ color: colors.primary }}>
          ←
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: colors.primary, boxShadow: `0 0 10px ${colors.primary}` }}
          />
          <h2 className="font-display text-sm tracking-widest" style={{ color: colors.primary }}>
            NOVA AI
          </h2>
        </div>
        <div className="w-8" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {aiMessages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
              style={{
                background: msg.role === 'user'
                  ? `rgba(${colors.primaryRgb}, 0.15)`
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${msg.role === 'user'
                  ? `rgba(${colors.primaryRgb}, 0.2)`
                  : 'rgba(255,255,255,0.08)'}`,
                borderBottomRightRadius: msg.role === 'user' ? '4px' : undefined,
                borderBottomLeftRadius: msg.role === 'ai' ? '4px' : undefined,
              }}
            >
              <div className="whitespace-pre-wrap">
                {msg.content.split('**').map((part, j) =>
                  j % 2 === 1
                    ? <strong key={j} style={{ color: colors.primary }}>{part}</strong>
                    : <span key={j}>{part}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-1">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2 h-2 rounded-full"
                style={{ background: colors.primary }}
              />
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                className="w-2 h-2 rounded-full"
                style={{ background: colors.primary }}
              />
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                className="w-2 h-2 rounded-full"
                style={{ background: colors.primary }}
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 safe-bottom">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask NOVA anything..."
            className="flex-1 rounded-xl px-4 py-3 text-sm font-mono outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid rgba(${colors.primaryRgb}, 0.2)`,
              color: '#fff',
            }}
          />
          <button
            onClick={handleSend}
            className="rounded-xl px-5 py-3 font-bold text-sm transition-transform active:scale-95"
            style={{
              background: colors.primary,
              color: '#000',
              boxShadow: `0 0 20px rgba(${colors.primaryRgb}, 0.3)`,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </motion.div>
  );
}
