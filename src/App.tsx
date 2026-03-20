import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { PROJECTS } from './data/projects'
import GlitchBg from './components/GlitchBg'
import ProjectViz from './components/ProjectViz'
import IdCard3D from './components/IdCard3D'
import 'lenis/dist/lenis.css'
import './App.css'

const VIZ_MAP: Record<string, 'neural' | 'waveform' | 'grid' | 'circuit' | 'pulse'> = {
  ecoclassify: 'neural',
  hymnonics: 'waveform',
  joblink: 'grid',
  farmcare: 'circuit',
  'voice-assistant': 'pulse',
}

gsap.registerPlugin(ScrollTrigger)

const ACHIEVEMENTS = [
  'GOOGLE GEN AI EXCHANGE',
  'SMART INDIA HACKATHON',
  'AWS GENERATIVE AI',
  'ORACLE CLOUD',
  'NPTEL PYTHON',
  'TCS ION',
]

const SCRAMBLE_TARGET = 'A lab where each problem will be crafted.'
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'

function App() {
  const navigate = useNavigate()
  const [showIntro, setShowIntro] = useState(true)
  const [glitchActive, setGlitchActive] = useState(true)
  const [navOpen, setNavOpen] = useState(false)
  const [scrambleText, setScrambleText] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrambleRef = useRef<HTMLParagraphElement>(null)
  const scrambleDone = useRef(false)
  const lenisRef = useRef<Lenis | null>(null)
  const lenisRafRef = useRef<((time: number) => void) | null>(null)

  // Intro timers
  useEffect(() => {
    const glitchTimer = setTimeout(() => setGlitchActive(false), 1500)
    const introTimer = setTimeout(() => setShowIntro(false), 3000)
    return () => {
      clearTimeout(glitchTimer)
      clearTimeout(introTimer)
    }
  }, [])

  // Smooth scroll with Lenis + GSAP ScrollTrigger integration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.08,
    })

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000)
    }

    lenisRef.current = lenis
    lenisRafRef.current = rafCallback

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenisRef.current = null
      lenisRafRef.current = null
      gsap.ticker.remove(rafCallback)
      lenis.destroy()
    }
  }, [])

  // Kill Lenis + GSAP completely, reset scroll, then navigate
  const cleanupAndNavigate = useCallback((path: string) => {
    // 1. Stop Lenis immediately so its RAF can't override scroll
    if (lenisRef.current) {
      lenisRef.current.stop()
      lenisRef.current.destroy()
      lenisRef.current = null
    }
    // 2. Remove the ticker callback so GSAP stops calling Lenis
    if (lenisRafRef.current) {
      gsap.ticker.remove(lenisRafRef.current)
      lenisRafRef.current = null
    }
    // 3. Kill all ScrollTriggers
    ScrollTrigger.getAll().forEach((t) => t.kill())
    ScrollTrigger.clearScrollMemory()
    // 4. Remove Lenis CSS classes
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling')
    // 5. Reset scroll
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    // 6. Navigate
    navigate(path)
  }, [navigate])

  // Waveform canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0
    let rafId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      // Draw 3 layered sine waves
      for (let layer = 0; layer < 3; layer++) {
        ctx.strokeStyle = `rgba(255,255,255,${0.4 - layer * 0.12})`
        ctx.lineWidth = 1.5 - layer * 0.3
        ctx.beginPath()
        const freq = 0.012 + layer * 0.004
        const amp = 25 - layer * 5
        const phase = time + layer * 1.2
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.5 + phase * 0.7) * (amp * 0.3)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      time += 0.03
      rafId = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Scramble text on scroll
  const runScramble = useCallback(() => {
    if (scrambleDone.current) return
    scrambleDone.current = true
    let iteration = 0
    const interval = setInterval(() => {
      setScrambleText(
        SCRAMBLE_TARGET.split('')
          .map((char, i) => {
            if (i < iteration) return SCRAMBLE_TARGET[i]
            if (char === ' ') return ' '
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
          .join('')
      )
      iteration += 1
      if (iteration > SCRAMBLE_TARGET.length) clearInterval(interval)
    }, 30)
  }, [])

  // Scroll-triggered animations
  useEffect(() => {
    // General reveal-on-scroll elements
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            if (entry.target.classList.contains('about-section')) {
              runScramble()
            }
          }
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el))

    // GSAP ScrollTrigger animations for each project showcase
    const showcases = gsap.utils.toArray<HTMLElement>('.project-showcase')
    const triggers: ScrollTrigger[] = []

    showcases.forEach((el, i) => {
      const layout = el.querySelector('.ps-layout') as HTMLElement | null
      const left = el.querySelector('.ps-left') as HTMLElement | null
      const title = el.querySelector('.ps-title') as HTMLElement | null
      const counter = el.querySelector('.ps-counter') as HTMLElement | null
      const techRow = el.querySelector('.ps-tech') as HTMLElement | null

      // ═══ ENTER: content reveals when card enters viewport ═══
      const enterTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 0.6,
        },
      })

      // Left panel slides in from left
      if (left) {
        enterTl.fromTo(left,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: 'none' },
          0
        )
      }

      // Title slides in from right
      if (title) {
        enterTl.fromTo(title,
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: 'none' },
          0.05
        )
      }

      // Counter fades in
      if (counter) {
        enterTl.fromTo(counter,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'none' },
          0.15
        )
      }

      // Tech row fades up
      if (techRow) {
        enterTl.fromTo(techRow,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'none' },
          0.2
        )
      }

      // Separator line wipe
      enterTl.fromTo(el,
        { '--sep-scale': 0 } as gsap.TweenVars,
        { '--sep-scale': 1, duration: 0.5, ease: 'none' } as gsap.TweenVars,
        0
      )

      if (enterTl.scrollTrigger) triggers.push(enterTl.scrollTrigger)

      // ═══ EXIT: when next card covers this one, content recedes ═══
      if (i < showcases.length - 1) {
        const nextEl = showcases[i + 1]
        const exitTl = gsap.timeline({
          scrollTrigger: {
            trigger: nextEl,
            start: 'top bottom',
            end: 'top 30%',
            scrub: 0.6,
          },
        })

        // Layout scales down and fades (content only — bg/viz stay)
        if (layout) {
          exitTl.to(layout,
            { scale: 0.95, opacity: 0, duration: 1, ease: 'none' },
            0
          )
        }

        // Counter fades
        if (counter) {
          exitTl.to(counter,
            { opacity: 0, duration: 0.5, ease: 'none' },
            0
          )
        }

        // Fade separator
        exitTl.to(el,
          { '--sep-scale': 0, duration: 0.5, ease: 'none' } as gsap.TweenVars,
          0.2
        )

        if (exitTl.scrollTrigger) triggers.push(exitTl.scrollTrigger)
      }

      // ═══ PARALLAX: subtle Y float on layout (independent axis) ═══
      if (layout) {
        gsap.fromTo(layout,
          { y: 25 },
          {
            y: -25,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
        triggers.push(ScrollTrigger.getAll().pop()!)
      }
    })

    return () => {
      observer.disconnect()
      triggers.forEach((t) => t.kill())
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [runScramble])

  // Experience expand toggle
  const toggleExpDetails = (e: React.MouseEvent<HTMLDivElement>) => {
    const item = e.currentTarget
    item.querySelector('.exp-details')?.classList.toggle('active')
  }

  // Close nav on link click
  const handleNavClick = () => setNavOpen(false)

  // Nav toggle
  const toggleNav = () => setNavOpen((v) => !v)

  return (
    <>
      {/* INTRO LOADING SCREEN */}
      {showIntro && (
        <div className="intro-screen">
          <GlitchBg opacity={0.6} tint="#CC0000" />
          <div className="intro-content">
            <div className={`intro-title ${glitchActive ? 'glitch' : ''}`}>
              VRAJ
            </div>
            <div className="intro-subtitle">
              <span>DEVELOPER</span>
              <span className="intro-dash">&mdash;</span>
              <span>ENGINEER</span>
              <span className="intro-dash">&mdash;</span>
              <span>BUILDER</span>
            </div>
            <div className="loading-container">
              <div className="loading-bar" />
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL GLITCH BACKGROUND — fixed behind everything */}
      <div className="global-glitch">
        <GlitchBg opacity={0.3} tint="#CC0000" />
      </div>

      {/* NOISE & SCANLINES */}
      <svg style={{ position: 'fixed', width: 0, height: 0 }}>
        <defs>
          <filter id="grainFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
          </filter>
        </defs>
      </svg>
      <div className="grain-container" aria-hidden="true">
        <div className="grain-animation" />
      </div>
      <div className="scanlines" aria-hidden="true" />

      {/* STICKY HEADER */}
      <header className="header">
        <a href="#hero" className="logo">VRAJ</a>
        <button
          className={`hamburger ${navOpen ? 'active' : ''}`}
          onClick={toggleNav}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>
      </header>

      {/* FULLSCREEN NAV OVERLAY */}
      <nav className={`nav-overlay ${navOpen ? 'active' : ''}`}>
        <GlitchBg opacity={0.3} tint="#CC0000" />
        <ul className="nav-links">
          {['WORK', 'ABOUT', 'SKILLS', 'EXPERIENCE', 'CONTACT'].map((label, i) => (
            <li key={label} style={{ transitionDelay: `${i * 50}ms` }}>
              <a href={`#${label.toLowerCase()}`} onClick={handleNavClick}>{label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-socials">
          <a href="https://github.com/vrajchauhan" target="_blank" rel="noopener noreferrer">GITHUB</a>
          <a href="https://linkedin.com/in/vrajchauhan" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a href="mailto:vrajc494@gmail.com">EMAIL</a>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="portfolio">
        {/* HERO */}
        <section id="hero" className="hero-section">
          <div className="hero-content">
            <div className="hero-main">
              <div className="hero-text">
                <div className="hero-label">FULL STACK DEVELOPER &mdash; INDIA</div>
                <h1 className="hero-title">
                  <span className="word-reveal" style={{ animationDelay: '3.1s' }}>WE BUILD.</span>
                  <span className="word-reveal" style={{ animationDelay: '3.25s' }}>WE SOLVE.</span>
                  <span className="word-reveal" style={{ animationDelay: '3.4s' }}>WE SHIP.</span>
                </h1>
              </div>
              <div className="hero-portrait">
                <IdCard3D />
              </div>
            </div>
            <div className="hero-bottom">
              <p className="hero-tagline">Crafting digital experiences<br />that push boundaries.</p>
              <div className="scroll-indicator">
                <div className="scroll-line" />
                <span>SCROLL</span>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT / IDENTITY */}
        <section id="about" className="about-section reveal-on-scroll">
          <div className="about-waveform-row">
            <span className="year-marker">2022</span>
            <canvas ref={canvasRef} className="waveform-canvas" />
            <span className="year-marker">2026</span>
          </div>
          <p className="about-quote" ref={scrambleRef}>
            {scrambleText || '\u00A0'}
          </p>
        </section>

        {/* SELECTED WORKS — CINEMATIC FULLSCREEN */}
        <section id="work">
          <div className="works-header reveal-on-scroll">
            <h2 className="section-title">SELECTED WORKS</h2>
          </div>
          {PROJECTS.map((p, idx) => (
            <div
              className="project-showcase"
              key={p.slug}
              style={{ zIndex: (idx + 1) * 10 }}
              onClick={() => cleanupAndNavigate(`/project/${p.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') cleanupAndNavigate(`/project/${p.slug}`); }}
            >
              <div className="ps-bg">
                <div className="ps-bg-gradient" />
                {p.image && <img src={p.image} alt="" className="ps-bg-image" loading="lazy" />}
                <ProjectViz type={VIZ_MAP[p.slug] || 'neural'} className="ps-viz" />
                <div className="ps-bg-overlay" />
              </div>
              <div className="ps-layout">
                <div className="ps-left">
                  <div className="ps-meta">
                    <span className="ps-category">{p.category}</span>
                    <span className="ps-year">{p.year}</span>
                    <span className="ps-duration">{p.duration}</span>
                  </div>
                  <p className="ps-subtitle">{p.subtitle}</p>
                  <p className="ps-description">{p.description[0]}</p>
                  <div className="ps-tags">
                    {p.tags.split(' · ').map((tag) => (
                      <span className="ps-tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="ps-tech">
                    {p.tech.slice(0, 5).map((t) => (
                      <span className="ps-tech-item" key={t}>{t}</span>
                    ))}
                  </div>
                  <span className="ps-cta">
                    VIEW PROJECT <span className="ps-cta-arrow">&rarr;</span>
                  </span>
                </div>
                <div className="ps-right">
                  <h2 className="ps-title">{p.name}</h2>
                </div>
              </div>
              {/* Sequence counter */}
              <div className="ps-counter">
                <span className="ps-counter-current">{String(idx + 1).padStart(2, '0')}</span>
                <span className="ps-counter-sep">/</span>
                <span className="ps-counter-total">{String(PROJECTS.length).padStart(2, '0')}</span>
              </div>
            </div>
          ))}
        </section>

        {/* SKILLS */}
        <section id="skills" className="skills-section reveal-on-scroll">
          <h2 className="section-title">TECHNICAL ARSENAL</h2>
          <div className="skills-grid">
            <div className="skills-col">
              <h3 className="skills-label">FULL STACK</h3>
              <div className="skills-tags">
                {['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'Firebase', 'Tailwind CSS'].map((s) => (
                  <span className="skill-tag" key={s}>{s}</span>
                ))}
              </div>
            </div>
            <div className="skills-col">
              <h3 className="skills-label">AI / ML / CLOUD</h3>
              <div className="skills-tags">
                {['Python', 'TensorFlow', 'PyTorch', 'AWS', 'Google Cloud', 'NLP'].map((s) => (
                  <span className="skill-tag" key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Tech ticker */}
          <div className="tech-ticker">
            <div className="tech-ticker-track">
              {[...Array(2)].map((_, setIdx) => (
                <div className="tech-ticker-set" key={setIdx}>
                  {['REACT.JS', 'NODE.JS', 'PYTHON', 'TENSORFLOW', 'AWS', 'MONGODB', 'NEXT.JS', 'FIREBASE', 'TAILWIND', 'PYTORCH', 'GOOGLE CLOUD', 'NLP'].map((t, i) => (
                    <span key={`${setIdx}-${i}`}>
                      {t}<span className="ticker-dot">&middot;</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="experience-section reveal-on-scroll">
          <h2 className="section-title">EXPERIENCE</h2>
          <div className="experience-list">
            <div className="experience-item" onClick={toggleExpDetails}>
              <div className="exp-row">
                <span className="exp-company">SHELL INDIA & EDUNET</span>
                <span className="exp-role">AI/ML INTERN</span>
                <span className="exp-date">JUN &ndash; JUL 2025</span>
              </div>
              <div className="exp-details">
                <ul>
                  <li>Developed ML models for industrial data optimization using Python and TensorFlow</li>
                  <li>Collaborated with cross-functional teams on AI-driven solutions</li>
                </ul>
              </div>
            </div>
            <div className="experience-item" onClick={toggleExpDetails}>
              <div className="exp-row">
                <span className="exp-company">EY GDS & AICTE</span>
                <span className="exp-role">MERN DEVELOPER</span>
                <span className="exp-date">DEC 2024 &ndash; JAN 2025</span>
              </div>
              <div className="exp-details">
                <ul>
                  <li>Built full-stack web applications using React, Node.js and MongoDB</li>
                  <li>Implemented responsive design patterns and performance optimizations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section className="achievements-section">
          <div className="achievements-ticker">
            {[...Array(3)].map((_, setIdx) => (
              <div className="ach-set" key={setIdx}>
                {ACHIEVEMENTS.map((a, i) => (
                  <span key={`${setIdx}-${i}`}>
                    {a}<span className="ach-dot">&middot;</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact-section reveal-on-scroll">
          <h2 className="contact-title">LET'S BUILD<br />SOMETHING</h2>
          <div className="contact-grid">
            {[
              { label: 'EMAIL', value: 'vrajc494@gmail.com', href: 'mailto:vrajc494@gmail.com' },
              { label: 'PHONE', value: '9825284593', href: 'tel:+919825284593' },
              { label: 'LINKEDIN', value: 'linkedin.com/in/vrajchauhan', href: 'https://linkedin.com/in/vrajchauhan' },
              { label: 'GITHUB', value: 'github.com/vrajchauhan', href: 'https://github.com/vrajchauhan' },
              { label: 'LOCATION', value: 'Gandhinagar, Gujarat, India' },
            ].map((c) => (
              <div className="contact-row" key={c.label}>
                <span className="contact-label">{c.label}</span>
                {c.href ? (
                  <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{c.value}</a>
                ) : (
                  <span className="contact-value">{c.value}</span>
                )}
              </div>
            ))}
          </div>
          <a href="mailto:vrajc494@gmail.com" className="cta-btn">
            SEND A MESSAGE <span className="cta-arrow">&rarr;</span>
          </a>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-top">
            <span className="footer-logo">VRAJ CHAUHAN</span>
            <div className="footer-socials">
              <a href="https://github.com/vrajchauhan" target="_blank" rel="noopener noreferrer">GITHUB</a>
              <a href="https://linkedin.com/in/vrajchauhan" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
              <a href="mailto:vrajc494@gmail.com">EMAIL</a>
            </div>
          </div>
          <div className="footer-sep" />
          <div className="footer-bottom">
            <span>&copy; 2025 VRAJ CHAUHAN. ALL RIGHTS RESERVED.</span>
            <a href="#hero" className="back-to-top">BACK TO TOP &uarr;</a>
          </div>
        </footer>
      </main>
    </>
  )
}

export default App
