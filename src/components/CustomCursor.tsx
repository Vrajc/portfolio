"use client"

import { useEffect } from 'react'

export default function CustomCursor() {
  useEffect(() => {
    const dot = document.createElement('div')
    dot.className = 'cursor-dot'
    document.body.appendChild(dot)

    const follower = document.createElement('div')
    follower.className = 'cursor-follower'
    document.body.appendChild(follower)

    let mx = 0, my = 0, fx = 0, fy = 0
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = `${mx - 4}px`
      dot.style.top = `${my - 4}px`
      dot.style.opacity = '1'
      follower.style.opacity = '1'
    }

    const onLeave = () => {
      dot.style.opacity = '0'
      follower.style.opacity = '0'
    }

    const animate = () => {
      fx += (mx - fx) * 0.12
      fy += (my - fy) * 0.12
      follower.style.left = `${fx - 16}px`
      follower.style.top = `${fy - 16}px`
      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId)
      document.body.removeChild(dot)
      document.body.removeChild(follower)
    }
  }, [])

  return null
}
