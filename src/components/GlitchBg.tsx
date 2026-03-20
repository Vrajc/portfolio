import { useEffect, useRef } from 'react'

interface GlitchBgProps {
  /** Base opacity of the effect (0–1). Default 0.45 */
  opacity?: number
  /** Accent color for tinted glitch blocks. CSS color string. */
  tint?: string
}

/**
 * MXMS-style block glitch canvas.
 * Dense horizontal rectangular blocks in red + grey only,
 * displacement bands, vertical scanline overlay.
 * Updates at ~15fps for a frozen/stuttery feel.
 */
export default function GlitchBg({ opacity = 0.45, tint = '#CC0000' }: GlitchBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const SCALE = 3
    let w = 0
    let h = 0
    let rafId = 0
    let visible = true
    let frame = 0

    // Parse tint color to RGB
    const parseTint = (color: string): [number, number, number] => {
      const hex = color.replace('#', '')
      return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16),
      ]
    }
    const [tr, tg, tb] = parseTint(tint)

    const resize = () => {
      w = Math.ceil(canvas.offsetWidth / SCALE)
      h = Math.ceil(canvas.offsetHeight / SCALE)
      canvas.width = w
      canvas.height = h
    }
    resize()

    const drawFrame = () => {
      const imgData = ctx.createImageData(w, h)
      const data = imgData.data

      // 1 — Near-black base (deep, dark foundation)
      for (let i = 0; i < data.length; i += 4) {
        const v = 1 + Math.floor(Math.random() * 4)
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 255
      }

      // 2 — Massive dark glitch blocks (bigger, darker, heavier)
      const blockCount = 40 + Math.floor(Math.random() * 45)
      for (let b = 0; b < blockCount; b++) {
        const by = Math.floor(Math.random() * h)
        const bh = 2 + Math.floor(Math.random() * Math.max(2, Math.floor(h * 0.12)))
        const bx = Math.floor(Math.random() * w * 0.6)
        const bw = 30 + Math.floor(Math.random() * w * 0.7)

        const type = Math.random()
        let br: number, bg: number, bb: number, ba: number

        if (type < 0.4) {
          // Very dark block (near black)
          const g = 2 + Math.floor(Math.random() * 8)
          br = g
          bg = g
          bb = g
          ba = 200 + Math.floor(Math.random() * 55)
        } else if (type < 0.65) {
          // Dark grey block
          const g = 8 + Math.floor(Math.random() * 18)
          br = g
          bg = g
          bb = g
          ba = 180 + Math.floor(Math.random() * 75)
        } else if (type < 0.8) {
          // Medium-dark grey block
          const g = 20 + Math.floor(Math.random() * 30)
          br = g
          bg = g
          bb = g
          ba = 140 + Math.floor(Math.random() * 80)
        } else {
          // Deep red accent block
          br = Math.floor(tr * (0.4 + Math.random() * 0.6))
          bg = Math.floor(tg * Math.random() * 0.1)
          bb = Math.floor(tb * Math.random() * 0.08)
          ba = 180 + Math.floor(Math.random() * 75)
        }

        const a = ba / 255
        for (let dy = 0; dy < bh && by + dy < h; dy++) {
          for (let dx = 0; dx < bw && bx + dx < w; dx++) {
            const idx = ((by + dy) * w + (bx + dx)) * 4
            data[idx] = Math.floor(data[idx] * (1 - a) + br * a)
            data[idx + 1] = Math.floor(data[idx + 1] * (1 - a) + bg * a)
            data[idx + 2] = Math.floor(data[idx + 2] * (1 - a) + bb * a)
          }
        }
      }

      // 3 — Horizontal displacement bands (shift entire rows, wider)
      const dispCount = 6 + Math.floor(Math.random() * 12)
      for (let d = 0; d < dispCount; d++) {
        const dy = Math.floor(Math.random() * h)
        const dh = 2 + Math.floor(Math.random() * 18)
        const shift = Math.floor((Math.random() - 0.3) * 40)

        for (let row = 0; row < dh && dy + row < h; row++) {
          const y = dy + row
          const rowStart = y * w * 4
          const temp = new Uint8ClampedArray(w * 4)
          temp.set(data.subarray(rowStart, rowStart + w * 4))

          for (let x = 0; x < w; x++) {
            const srcX = Math.max(0, Math.min(w - 1, x - shift))
            const dstIdx = rowStart + x * 4
            const srcIdx = srcX * 4
            data[dstIdx] = temp[srcIdx]
            data[dstIdx + 1] = temp[srcIdx + 1]
            data[dstIdx + 2] = temp[srcIdx + 2]
            data[dstIdx + 3] = temp[srcIdx + 3]
          }
        }
      }

      // 4 — Bold red accent blocks (larger, more prominent)
      const accentCount = 5 + Math.floor(Math.random() * 8)
      for (let i = 0; i < accentCount; i++) {
        const ax = Math.floor(Math.random() * w)
        const ay = Math.floor(Math.random() * h)
        const aw = 20 + Math.floor(Math.random() * 100)
        const ah = 2 + Math.floor(Math.random() * 14)
        const aa = 0.5 + Math.random() * 0.45

        for (let dy = 0; dy < ah && ay + dy < h; dy++) {
          for (let dx = 0; dx < aw && ax + dx < w; dx++) {
            const idx = ((ay + dy) * w + (ax + dx)) * 4
            data[idx] = Math.floor(data[idx] * (1 - aa) + tr * aa)
            data[idx + 1] = Math.floor(data[idx + 1] * (1 - aa))
            data[idx + 2] = Math.floor(data[idx + 2] * (1 - aa))
          }
        }
      }

      // 5 — Vertical scanlines (darken every other column)
      for (let x = 0; x < w; x += 2) {
        for (let y = 0; y < h; y++) {
          const idx = (y * w + x) * 4
          data[idx] = Math.floor(data[idx] * 0.6)
          data[idx + 1] = Math.floor(data[idx + 1] * 0.6)
          data[idx + 2] = Math.floor(data[idx + 2] * 0.6)
        }
      }

      // 6 — Horizontal red scan lines (no warm/yellow)
      const lineCount = 1 + Math.floor(Math.random() * 3)
      for (let l = 0; l < lineCount; l++) {
        const ly = Math.floor(Math.random() * h)
        for (let x = 0; x < w; x++) {
          const idx = (ly * w + x) * 4
          data[idx] = Math.min(255, data[idx] + 30 + Math.floor(Math.random() * 25))
          data[idx + 1] = Math.floor(data[idx + 1] * 0.8)
          data[idx + 2] = Math.floor(data[idx + 2] * 0.8)
        }
      }

      // 7 — Large displaced glitch chunks (bigger, bolder)
      const chunkCount = 2 + Math.floor(Math.random() * 4)
      for (let c = 0; c < chunkCount; c++) {
        const cy = Math.floor(Math.random() * h)
        const ch = 6 + Math.floor(Math.random() * 25)
        const cShift = Math.floor((Math.random() - 0.5) * 60)
        const cBright = Math.random() < 0.5

        for (let row = 0; row < ch && cy + row < h; row++) {
          const y = cy + row
          const rowStart = y * w * 4
          const temp = new Uint8ClampedArray(w * 4)
          temp.set(data.subarray(rowStart, rowStart + w * 4))

          for (let x = 0; x < w; x++) {
            const srcX = Math.max(0, Math.min(w - 1, x - cShift))
            const dstIdx = rowStart + x * 4
            const srcIdx = srcX * 4
            data[dstIdx] = temp[srcIdx]
            data[dstIdx + 1] = temp[srcIdx + 1]
            data[dstIdx + 2] = temp[srcIdx + 2]

            // Brighten or tint the chunk
            if (cBright) {
              const boost = 20 + Math.floor(Math.random() * 30)
              data[dstIdx] = Math.min(255, data[dstIdx] + boost)
            }
          }
        }
      }

      // 8 — Heavy film grain overlay (darker, grittier)
      for (let i = 0; i < data.length; i += 4) {
        const grain = Math.floor((Math.random() - 0.6) * 50)
        data[i] = Math.max(0, Math.min(255, data[i] + grain))
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain))
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain))
      }

      ctx.putImageData(imgData, 0, 0)
    }

    const draw = () => {
      if (!visible) {
        rafId = requestAnimationFrame(draw)
        return
      }

      frame++

      // Redraw every 4th frame (~15fps) for that frozen/stuttery glitch feel
      if (frame % 4 === 0) {
        drawFrame()
      }

      rafId = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    window.addEventListener('resize', resize)
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [opacity, tint])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        pointerEvents: 'none',
        imageRendering: 'pixelated',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  )
}
