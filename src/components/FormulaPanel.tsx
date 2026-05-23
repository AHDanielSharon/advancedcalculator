import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalcStore, THEMES } from '@/store/calculatorStore';

interface FormulaCategory {
  icon: string;
  name: string;
  formulas: { name: string; formula: string; description: string }[];
}

const CATEGORIES: FormulaCategory[] = [
  {
    icon: '📐', name: 'Geometry',
    formulas: [
      { name: 'Circle Area', formula: 'A = πr²', description: 'Area of a circle with radius r' },
      { name: 'Circle Circumference', formula: 'C = 2πr', description: 'Circumference with radius r' },
      { name: 'Sphere Volume', formula: 'V = 4/3 πr³', description: 'Volume of a sphere' },
      { name: 'Sphere Surface Area', formula: 'A = 4πr²', description: 'Surface area of a sphere' },
      { name: 'Cylinder Volume', formula: 'V = πr²h', description: 'Volume with radius r, height h' },
      { name: 'Cone Volume', formula: 'V = 1/3 πr²h', description: 'Volume of a cone' },
      { name: 'Pythagorean', formula: 'a² + b² = c²', description: 'Right triangle relationship' },
      { name: 'Triangle Area', formula: 'A = ½bh', description: 'Area with base b, height h' },
    ]
  },
  {
    icon: '📊', name: 'Algebra',
    formulas: [
      { name: 'Quadratic Formula', formula: 'x = (-b ± √(b²-4ac)) / 2a', description: 'Solve ax² + bx + c = 0' },
      { name: 'Distance Formula', formula: 'd = √((x₂-x₁)² + (y₂-y₁)²)', description: 'Distance between 2 points' },
      { name: 'Midpoint', formula: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)', description: 'Midpoint between 2 points' },
      { name: 'Slope', formula: 'm = (y₂-y₁)/(x₂-x₁)', description: 'Slope of a line' },
      { name: 'Point-Slope Form', formula: 'y - y₁ = m(x - x₁)', description: 'Line equation' },
      { name: 'Arithmetic Sequence', formula: 'aₙ = a₁ + (n-1)d', description: 'nth term of arithmetic seq' },
      { name: 'Geometric Sequence', formula: 'aₙ = a₁ × r^(n-1)', description: 'nth term of geometric seq' },
    ]
  },
  {
    icon: '📈', name: 'Calculus',
    formulas: [
      { name: 'Power Rule', formula: 'd/dx(xⁿ) = nxⁿ⁻¹', description: 'Derivative power rule' },
      { name: 'Product Rule', formula: 'd/dx(fg) = f\'g + fg\'', description: 'Derivative product rule' },
      { name: 'Chain Rule', formula: 'd/dx(f(g(x))) = f\'(g(x))·g\'(x)', description: 'Derivative chain rule' },
      { name: 'Integration Power', formula: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C', description: 'Power rule integration' },
      { name: 'Euler\'s Identity', formula: 'e^(iπ) + 1 = 0', description: 'Most beautiful equation' },
      { name: "Taylor Series", formula: 'f(x) = Σ f⁽ⁿ⁾(a)/n! · (x-a)ⁿ', description: 'Taylor expansion' },
    ]
  },
  {
    icon: '⚡', name: 'Physics',
    formulas: [
      { name: "Newton's 2nd Law", formula: 'F = ma', description: 'Force = mass × acceleration' },
      { name: 'Kinetic Energy', formula: 'KE = ½mv²', description: 'Energy of motion' },
      { name: 'Potential Energy', formula: 'PE = mgh', description: 'Gravitational PE' },
      { name: 'Work', formula: 'W = Fd cos θ', description: 'Work done by force' },
      { name: 'Power', formula: 'P = W/t', description: 'Rate of doing work' },
      { name: 'Momentum', formula: 'p = mv', description: 'Linear momentum' },
      { name: 'Coulomb\'s Law', formula: 'F = kq₁q₂/r²', description: 'Electric force' },
      { name: 'Ohm\'s Law', formula: 'V = IR', description: 'Voltage = current × resistance' },
      { name: 'Mass-Energy', formula: 'E = mc²', description: 'Einstein\'s equation' },
    ]
  },
  {
    icon: '🧪', name: 'Chemistry',
    formulas: [
      { name: 'Ideal Gas Law', formula: 'PV = nRT', description: 'Gas behavior equation' },
      { name: 'pH', formula: 'pH = -log[H⁺]', description: 'Acidity measure' },
      { name: 'Molarity', formula: 'M = mol/L', description: 'Concentration' },
      { name: 'Dilution', formula: 'M₁V₁ = M₂V₂', description: 'Dilution equation' },
      { name: 'Gibbs Free Energy', formula: 'ΔG = ΔH - TΔS', description: 'Spontaneity' },
    ]
  },
  {
    icon: '📊', name: 'Statistics',
    formulas: [
      { name: 'Mean', formula: 'μ = Σx / n', description: 'Average value' },
      { name: 'Std Deviation', formula: 'σ = √(Σ(x-μ)²/n)', description: 'Spread measure' },
      { name: 'Variance', formula: 'σ² = Σ(x-μ)²/n', description: 'Variance' },
      { name: 'Normal Dist', formula: 'f(x) = (1/σ√2π) e^(-(x-μ)²/2σ²)', description: 'Bell curve' },
      { name: 'Combinations', formula: 'C(n,r) = n! / (r!(n-r)!)', description: 'Choose r from n' },
      { name: 'Permutations', formula: 'P(n,r) = n! / (n-r)!', description: 'Arrange r from n' },
    ]
  },
  {
    icon: '🔌', name: 'Engineering',
    formulas: [
      { name: 'Ohm\'s Law', formula: 'V = IR', description: 'Voltage, current, resistance' },
      { name: 'Power (Electrical)', formula: 'P = IV = I²R = V²/R', description: 'Electrical power' },
      { name: 'Capacitance', formula: 'C = Q/V', description: 'Charge stored' },
      { name: 'Resonant Frequency', formula: 'f = 1/(2π√LC)', description: 'LC circuit resonance' },
      { name: 'Stress', formula: 'σ = F/A', description: 'Force per unit area' },
      { name: 'Strain', formula: 'ε = ΔL/L', description: 'Deformation ratio' },
    ]
  },
  {
    icon: '📐', name: 'Trigonometry',
    formulas: [
      { name: 'Pythagorean Identity', formula: 'sin²θ + cos²θ = 1', description: 'Fundamental identity' },
      { name: 'Double Angle (sin)', formula: 'sin(2θ) = 2sinθcosθ', description: 'Double angle formula' },
      { name: 'Double Angle (cos)', formula: 'cos(2θ) = cos²θ - sin²θ', description: 'Double angle formula' },
      { name: 'Law of Sines', formula: 'a/sinA = b/sinB = c/sinC', description: 'Triangle law' },
      { name: 'Law of Cosines', formula: 'c² = a² + b² - 2ab·cosC', description: 'Triangle law' },
    ]
  },
];

export default function FormulaPanel() {
  const { theme, setPanel } = useCalcStore();
  const colors = THEMES[theme];
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const activeCat = CATEGORIES.find(c => c.name === selectedCat);

  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="absolute inset-0 z-30 flex flex-col"
      style={{ background: 'rgba(5,5,10,0.98)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={() => selectedCat ? setSelectedCat(null) : setPanel('calc')}
          className="text-2xl"
          style={{ color: colors.primary }}
        >
          ←
        </button>
        <h2 className="font-display text-sm tracking-widest" style={{ color: colors.primary }}>
          {selectedCat || 'FORMULAS'}
        </h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          {!selectedCat ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-3"
            >
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedCat(cat.name)}
                  className="glass rounded-xl p-4 text-left active:scale-[0.97] transition-transform"
                  style={{ borderColor: `rgba(${colors.primaryRgb}, 0.1)` }}
                >
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <div className="text-sm font-semibold text-white">{cat.name}</div>
                  <div className="text-[10px] text-white/30 mt-0.5 font-mono">
                    {cat.formulas.length} formulas
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="formulas"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-2"
            >
              {activeCat?.formulas.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-xl p-3"
                >
                  <div className="text-xs text-white/40 font-mono mb-1">{f.name}</div>
                  <div className="text-lg font-mono font-bold" style={{ color: colors.primary }}>
                    {f.formula}
                  </div>
                  <div className="text-xs text-white/30 mt-1">{f.description}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
