import { useLayoutEffect, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PROJECTS } from '../data/projects'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const project = PROJECTS.find((p) => p.slug === slug)

  // Immediate scroll reset before paint
  useLayoutEffect(() => {
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling')
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [slug])

  // Post-paint: enforce scroll=0 for several frames to beat any lingering RAF callbacks
  useEffect(() => {
    let count = 0
    let rafId: number

    const forceTop = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      count++
      if (count < 10) {
        rafId = requestAnimationFrame(forceTop)
      }
    }

    rafId = requestAnimationFrame(forceTop)
    return () => cancelAnimationFrame(rafId)
  }, [slug])

  if (!project) {
    return (
      <div className="project-not-found">
        <span className="pnf-label">404</span>
        <h1 className="pnf-title">PROJECT NOT FOUND</h1>
        <Link to="/" className="pnf-back">BACK TO HOME &larr;</Link>
      </div>
    )
  }

  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug)
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length]

  return (
    <div className="project-detail">
      {/* BACK BUTTON */}
      <button className="pd-back" onClick={() => navigate('/')}>
        <span className="pd-back-arrow">&larr;</span>
        <span>BACK</span>
      </button>

      {/* HERO */}
      <section className="pd-hero">
        <img src={project.image} alt="" className="pd-hero-image" loading="eager" />
        <div className="pd-hero-overlay" />
        <div className="pd-hero-meta">
          <span className="pd-num">{project.num}</span>
          <span className="pd-category">{project.category}</span>
          <span className="pd-duration">{project.duration}</span>
        </div>
        <h1 className="pd-title">{project.name}</h1>
        <p className="pd-subtitle">{project.subtitle}</p>
        <div className="pd-tags-row">
          {project.tags.split(' · ').map((tag) => (
            <span className="pd-tag" key={tag}>{tag}</span>
          ))}
          <span className="pd-year">{project.year}</span>
        </div>
      </section>

      {/* CONTENT */}
      <div className="pd-content">
        {/* DESCRIPTION */}
        <section className="pd-section">
          <h2 className="pd-section-label">OVERVIEW</h2>
          <div className="pd-description">
            {project.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="pd-section">
          <h2 className="pd-section-label">KEY FEATURES</h2>
          <ul className="pd-features">
            {project.features.map((feat, i) => (
              <li key={i}>
                <span className="pd-feat-num">{String(i + 1).padStart(2, '0')}</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* TECH STACK */}
        <section className="pd-section">
          <h2 className="pd-section-label">TECH STACK</h2>
          <div className="pd-tech-tags">
            {project.tech.map((t) => (
              <span className="pd-tech-tag" key={t}>{t}</span>
            ))}
          </div>
        </section>

        {/* LINKS */}
        {project.links && project.links.length > 0 && (
          <section className="pd-section">
            <h2 className="pd-section-label">LINKS</h2>
            <div className="pd-links">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-link"
                >
                  {link.label} <span className="pd-link-arrow">&rarr;</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* NEXT PROJECT */}
      <Link
        to={`/project/${nextProject.slug}`}
        className="pd-next"
      >
        <span className="pd-next-label">NEXT PROJECT</span>
        <span className="pd-next-name">{nextProject.name}</span>
        <span className="pd-next-arrow">&rarr;</span>
      </Link>
    </div>
  )
}
