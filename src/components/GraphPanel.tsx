import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCalcStore, THEMES } from '@/store/calculatorStore';
import * as math from 'mathjs';

export default function GraphPanel() {
  const { graphExpression, setGraphExpression, theme, setPanel } = useCalcStore();
  const colors = THEMES[theme];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewWindow, setViewWindow] = useState({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  const [graphType, setGraphType] = useState<'2d' | 'polar' | 'parametric'>('2d');
  const [inputText, setInputText] = useState(graphExpression);
  const [error, setError] = useState('');

  // Touch state for panning/zooming
  const touchState = useRef({ lastX: 0, lastY: 0, lastDist: 0, isPanning: false });

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const { xMin, xMax, yMin, yMax } = viewWindow;

    // Background
    ctx.fillStyle = 'rgba(5,5,15,0.95)';
    ctx.fillRect(0, 0, w, h);

    // Grid
    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * w;
    const toScreenY = (y: number) => h - ((y - yMin) / (yMax - yMin)) * h;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;

    const xStep = Math.pow(10, Math.floor(Math.log10(xMax - xMin)) - 1) * 2;
    const yStep = Math.pow(10, Math.floor(Math.log10(yMax - yMin)) - 1) * 2;

    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, h);
      ctx.stroke();
    }
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(w, sy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    // X axis
    if (yMin <= 0 && yMax >= 0) {
      const sy = toScreenY(0);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(w, sy);
      ctx.stroke();
    }
    // Y axis
    if (xMin <= 0 && xMax >= 0) {
      const sx = toScreenX(0);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, h);
      ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      if (Math.abs(x) < 1e-10) continue;
      const sx = toScreenX(x);
      const sy = toScreenY(0);
      const labelY = (sy > 0 && sy < h) ? sy + 14 : h - 4;
      ctx.fillText(Number(x.toPrecision(3)).toString(), sx, labelY);
    }
    ctx.textAlign = 'right';
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      if (Math.abs(y) < 1e-10) continue;
      const sx = toScreenX(0);
      const sy = toScreenY(y);
      const labelX = (sx > 0 && sx < w) ? sx - 4 : 30;
      ctx.fillText(Number(y.toPrecision(3)).toString(), labelX, sy + 4);
    }

    // Plot function
    if (!graphExpression) return;

    try {
      const compiled = math.compile(graphExpression);
      setError('');

      if (graphType === '2d') {
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2;
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = 8;
        ctx.beginPath();

        let first = true;
        const steps = w * 2;
        for (let i = 0; i <= steps; i++) {
          const x = xMin + (i / steps) * (xMax - xMin);
          try {
            const y = compiled.evaluate({ x });
            if (typeof y !== 'number' || !isFinite(y)) {
              first = true;
              continue;
            }
            const sx = toScreenX(x);
            const sy = toScreenY(y);
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          } catch {
            first = true;
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Glow overlay
        ctx.strokeStyle = `rgba(${colors.primaryRgb}, 0.3)`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        first = true;
        for (let i = 0; i <= steps; i++) {
          const x = xMin + (i / steps) * (xMax - xMin);
          try {
            const y = compiled.evaluate({ x });
            if (typeof y !== 'number' || !isFinite(y)) {
              first = true;
              continue;
            }
            const sx = toScreenX(x);
            const sy = toScreenY(y);
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          } catch {
            first = true;
          }
        }
        ctx.stroke();

      } else if (graphType === 'polar') {
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2;
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = 8;
        ctx.beginPath();

        let first = true;
        for (let t = 0; t <= Math.PI * 4; t += 0.01) {
          try {
            const r = compiled.evaluate({ x: t, theta: t, t });
            if (typeof r !== 'number' || !isFinite(r)) {
              first = true;
              continue;
            }
            const x = r * Math.cos(t);
            const y = r * Math.sin(t);
            const sx = toScreenX(x);
            const sy = toScreenY(y);
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          } catch {
            first = true;
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    } catch {
      setError('Invalid expression');
    }
  }, [graphExpression, viewWindow, graphType, colors]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  // Touch handlers for pan/zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchState.current.lastX = e.touches[0].clientX;
      touchState.current.lastY = e.touches[0].clientY;
      touchState.current.isPanning = true;
    } else if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      touchState.current.lastDist = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && touchState.current.isPanning) {
      const dx = e.touches[0].clientX - touchState.current.lastX;
      const dy = e.touches[0].clientY - touchState.current.lastY;
      touchState.current.lastX = e.touches[0].clientX;
      touchState.current.lastY = e.touches[0].clientY;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const xRange = viewWindow.xMax - viewWindow.xMin;
      const yRange = viewWindow.yMax - viewWindow.yMin;
      const dxWorld = -(dx / rect.width) * xRange;
      const dyWorld = (dy / rect.height) * yRange;

      setViewWindow(v => ({
        xMin: v.xMin + dxWorld,
        xMax: v.xMax + dxWorld,
        yMin: v.yMin + dyWorld,
        yMax: v.yMax + dyWorld,
      }));
    } else if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scale = touchState.current.lastDist / dist;
      touchState.current.lastDist = dist;

      const cx = (viewWindow.xMax + viewWindow.xMin) / 2;
      const cy = (viewWindow.yMax + viewWindow.yMin) / 2;
      const hw = ((viewWindow.xMax - viewWindow.xMin) / 2) * scale;
      const hh = ((viewWindow.yMax - viewWindow.yMin) / 2) * scale;

      setViewWindow({
        xMin: cx - hw,
        xMax: cx + hw,
        yMin: cy - hh,
        yMax: cy + hh,
      });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const factor = e.deltaY > 0 ? 1.1 : 0.9;
    const cx = (viewWindow.xMax + viewWindow.xMin) / 2;
    const cy = (viewWindow.yMax + viewWindow.yMin) / 2;
    const hw = ((viewWindow.xMax - viewWindow.xMin) / 2) * factor;
    const hh = ((viewWindow.yMax - viewWindow.yMin) / 2) * factor;
    setViewWindow({ xMin: cx - hw, xMax: cx + hw, yMin: cy - hh, yMax: cy + hh });
  };

  const applyExpression = () => {
    setGraphExpression(inputText);
  };

  const resetView = () => {
    setViewWindow({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="absolute inset-0 z-30 flex flex-col"
      style={{ background: 'rgba(5,5,10,0.98)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={() => setPanel('calc')} className="text-2xl" style={{ color: colors.primary }}>
          ←
        </button>
        <h2 className="font-display text-sm tracking-widest" style={{ color: colors.primary }}>
          GRAPH ENGINE
        </h2>
        <button
          onClick={resetView}
          className="text-xs font-mono px-3 py-1 rounded-full"
          style={{
            color: colors.primary,
            background: `rgba(${colors.primaryRgb}, 0.1)`,
            border: `1px solid rgba(${colors.primaryRgb}, 0.2)`,
          }}
        >
          Reset
        </button>
      </div>

      {/* Graph type tabs */}
      <div className="flex gap-2 px-4 pb-2">
        {(['2d', 'polar', 'parametric'] as const).map(type => (
          <button
            key={type}
            onClick={() => setGraphType(type)}
            className="text-xs font-mono px-3 py-1.5 rounded-full transition-colors"
            style={{
              background: graphType === type ? `rgba(${colors.primaryRgb}, 0.2)` : 'rgba(255,255,255,0.03)',
              color: graphType === type ? colors.primary : 'rgba(255,255,255,0.4)',
              border: `1px solid ${graphType === type ? `rgba(${colors.primaryRgb}, 0.3)` : 'rgba(255,255,255,0.05)'}`,
            }}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-2">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid rgba(${colors.primaryRgb}, 0.2)`,
            }}
          >
            <span className="text-xs font-mono" style={{ color: colors.primary }}>f(x) =</span>
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyExpression()}
              className="flex-1 bg-transparent outline-none text-sm font-mono text-white"
              placeholder="sin(x)"
            />
          </div>
          <button
            onClick={applyExpression}
            className="rounded-xl px-4 font-bold text-sm active:scale-95 transition-transform"
            style={{
              background: colors.primary,
              color: '#000',
            }}
          >
            Plot
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-400 mt-1 font-mono">{error}</p>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 mx-4 mb-4 rounded-xl overflow-hidden relative"
        style={{ border: `1px solid rgba(${colors.primaryRgb}, 0.15)` }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onWheel={handleWheel}
          style={{ touchAction: 'none' }}
        />
        {/* Crosshair center */}
        <div className="absolute bottom-3 left-3 text-[10px] font-mono opacity-30">
          [{viewWindow.xMin.toFixed(1)}, {viewWindow.xMax.toFixed(1)}] ×
          [{viewWindow.yMin.toFixed(1)}, {viewWindow.yMax.toFixed(1)}]
        </div>
      </div>
    </motion.div>
  );
}
