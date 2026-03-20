import { useEffect, useRef } from 'react'

type VizType = 'neural' | 'waveform' | 'grid' | 'circuit' | 'pulse'

interface Props {
  type: VizType
  className?: string
}

// ── Drawing helpers ──────────────────────────────────────────────

function drawNeural(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Scattered nodes with drifting connections — AI / neural-net feel
  const nodes: { x: number; y: number; r: number }[] = []
  const seed = 42
  const count = 18
  for (let i = 0; i < count; i++) {
    const hash = Math.sin(seed + i * 127.1) * 43758.5453
    const nx = (hash - Math.floor(hash)) * w
    const hash2 = Math.sin(seed + i * 269.5) * 43758.5453
    const ny = (hash2 - Math.floor(hash2)) * h
    const drift = Math.sin(t * 0.4 + i * 0.7) * 12
    nodes.push({ x: nx + drift, y: ny + Math.cos(t * 0.3 + i) * 8, r: 2 + (i % 3) })
  }

  // Connections
  ctx.lineWidth = 1
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 300) {
        const alpha = (1 - dist / 300) * 0.6
        ctx.strokeStyle = `rgba(204, 0, 0, ${alpha})`
        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[j].x, nodes[j].y)
        ctx.stroke()
      }
    }
  }

  // Nodes
  for (const n of nodes) {
    const pulse = 1 + Math.sin(t * 1.5 + n.x * 0.01) * 0.3
    ctx.fillStyle = `rgba(204, 0, 0, ${0.7 * pulse})`
    ctx.beginPath()
    ctx.arc(n.x, n.y, n.r * pulse * 1.5, 0, Math.PI * 2)
    ctx.fill()

    // Glow ring
    ctx.strokeStyle = `rgba(204, 0, 0, ${0.2 * pulse})`
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(n.x, n.y, n.r * pulse * 5, 0, Math.PI * 2)
    ctx.stroke()
  }
}

function drawWaveform(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Equalizer-style frequency bars — music feel
  const bars = 48
  const gap = w / bars
  const midY = h * 0.5

  for (let i = 0; i < bars; i++) {
    const x = i * gap + gap * 0.5
    const freq = Math.sin(t * 0.8 + i * 0.35) * 0.5 + 0.5
    const freq2 = Math.sin(t * 1.2 + i * 0.2) * 0.3 + 0.3
    const barH = (freq * freq2) * h * 0.4

    const alpha = 0.25 + freq * 0.5
    ctx.fillStyle = `rgba(204, 0, 0, ${alpha})`
    ctx.fillRect(x - 2, midY - barH, 4, barH * 2)

    // Peak dot
    if (freq > 0.6) {
      ctx.fillStyle = `rgba(204, 0, 0, ${0.8 * freq})`
      ctx.fillRect(x - 2.5, midY - barH - 8, 5, 3)
      ctx.fillRect(x - 2.5, midY + barH + 5, 5, 3)
    }
  }

  // Horizontal center line
  ctx.strokeStyle = 'rgba(204, 0, 0, 0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, midY)
  ctx.lineTo(w, midY)
  ctx.stroke()
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Data matrix / corporate grid — job portal feel
  const cols = 12
  const rows = 8
  const cellW = w / cols
  const cellH = h / rows

  // Grid lines
  ctx.strokeStyle = 'rgba(204, 0, 0, 0.12)'
  ctx.lineWidth = 0.8
  for (let i = 0; i <= cols; i++) {
    ctx.beginPath()
    ctx.moveTo(i * cellW, 0)
    ctx.lineTo(i * cellW, h)
    ctx.stroke()
  }
  for (let j = 0; j <= rows; j++) {
    ctx.beginPath()
    ctx.moveTo(0, j * cellH)
    ctx.lineTo(w, j * cellH)
    ctx.stroke()
  }

  // Animated highlights sweeping across cells
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const phase = Math.sin(t * 0.5 + i * 0.6 + j * 0.4)
      if (phase > 0.6) {
        const alpha = (phase - 0.6) * 1.2
        ctx.fillStyle = `rgba(204, 0, 0, ${alpha * 0.35})`
        ctx.fillRect(i * cellW + 2, j * cellH + 2, cellW - 4, cellH - 4)
      }
      // Corner dots on active cells
      if (phase > 0.7) {
        ctx.fillStyle = `rgba(204, 0, 0, ${(phase - 0.7) * 2.5})`
        ctx.fillRect(i * cellW - 1, j * cellH - 1, 3, 3)
      }
    }
  }

  // Sweep line
  const sweepX = ((t * 40) % (w + 200)) - 100
  ctx.strokeStyle = 'rgba(204, 0, 0, 0.25)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(sweepX, 0)
  ctx.lineTo(sweepX, h)
  ctx.stroke()
}

function drawCircuit(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Circuit board trace pattern — mobile/hardware feel
  const traces: { x1: number; y1: number; x2: number; y2: number }[] = []
  const junctions: { x: number; y: number }[] = []
  const seed = 91

  // Generate deterministic paths
  for (let i = 0; i < 14; i++) {
    const hash = Math.sin(seed + i * 157.3) * 43758.5453
    const sx = (hash - Math.floor(hash)) * w
    const hash2 = Math.sin(seed + i * 312.7) * 43758.5453
    const sy = (hash2 - Math.floor(hash2)) * h

    // Right-angle traces
    const len = 60 + (i % 5) * 30
    const dir = i % 4
    let ex = sx, ey = sy
    if (dir === 0) ex = sx + len
    else if (dir === 1) ey = sy + len
    else if (dir === 2) ex = sx - len
    else ey = sy - len

    traces.push({ x1: sx, y1: sy, x2: ex, y2: ey })
    junctions.push({ x: sx, y: sy })
    junctions.push({ x: ex, y: ey })
  }

  // Draw traces with signal pulse
  for (let i = 0; i < traces.length; i++) {
    const tr = traces[i]
    ctx.strokeStyle = 'rgba(204, 0, 0, 0.25)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(tr.x1, tr.y1)
    ctx.lineTo(tr.x2, tr.y2)
    ctx.stroke()

    // Signal traveling along trace
    const progress = ((t * 0.6 + i * 0.5) % 2) / 2
    if (progress < 1) {
      const px = tr.x1 + (tr.x2 - tr.x1) * progress
      const py = tr.y1 + (tr.y2 - tr.y1) * progress
      ctx.fillStyle = `rgba(204, 0, 0, ${0.85 * (1 - progress)})`
      ctx.beginPath()
      ctx.arc(px, py, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Junction dots
  for (const j of junctions) {
    const pulse = Math.sin(t + j.x * 0.02 + j.y * 0.02) * 0.5 + 0.5
    ctx.fillStyle = `rgba(204, 0, 0, ${0.35 + pulse * 0.35})`
    ctx.fillRect(j.x - 2, j.y - 2, 4, 4)
  }
}

function drawPulse(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Voice waveform ripple — NLP / audio feel
  const lines = 5
  const midY = h * 0.5

  for (let l = 0; l < lines; l++) {
    const offset = (l - Math.floor(lines / 2)) * 40
    const alpha = 0.2 + (1 - Math.abs(l - 2) / 2) * 0.35
    ctx.strokeStyle = `rgba(204, 0, 0, ${alpha})`
    ctx.lineWidth = 2 - Math.abs(l - 2) * 0.3

    ctx.beginPath()
    for (let x = 0; x < w; x += 2) {
      const n = x / w
      // Envelope: louder in center, fades at edges
      const env = Math.sin(n * Math.PI)
      const wave = Math.sin(x * 0.03 + t * 1.5 + l * 0.8) * 28 * env
      const wave2 = Math.sin(x * 0.06 - t * 0.9 + l * 1.2) * 12 * env
      const y = midY + offset + wave + wave2
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // Sweep highlight
  const sweepProgress = (t * 0.15) % 1
  const sweepX = sweepProgress * w
  const grad = ctx.createLinearGradient(sweepX - 120, 0, sweepX + 120, 0)
  grad.addColorStop(0, 'rgba(204, 0, 0, 0)')
  grad.addColorStop(0.5, 'rgba(204, 0, 0, 0.18)')
  grad.addColorStop(1, 'rgba(204, 0, 0, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(sweepX - 120, 0, 240, h)
}

// ── Mapping & Component ────────────────────────────────────────

const drawFns: Record<VizType, (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void> = {
  neural: drawNeural,
  waveform: drawWaveform,
  grid: drawGrid,
  circuit: drawCircuit,
  pulse: drawPulse,
}

export default function ProjectViz({ type, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const visibleRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // IO for perf — only animate when visible
    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting },
      { threshold: 0.05 }
    )
    io.observe(canvas)

    let time = 0
    let lastFrame = 0
    const FPS_INTERVAL = 1000 / 20 // cap at 20fps

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = drawFns[type]

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop)
      if (!visibleRef.current) return
      if (now - lastFrame < FPS_INTERVAL) return
      lastFrame = now

      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      time += 0.016
      draw(ctx, rect.width, rect.height, time)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      io.disconnect()
    }
  }, [type])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
