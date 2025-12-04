"use client"

import { useEffect, useState } from "react"

interface TreeEdgeProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
  isAnimated?: boolean
}

export function TreeEdge({ from, to, isAnimated = false }: TreeEdgeProps) {
  const [isVisible, setIsVisible] = useState(!isAnimated)
  const nodeRadius = 20

  useEffect(() => {
    if (isAnimated) {
      setIsVisible(false)
      const timer = setTimeout(() => setIsVisible(true), 200)
      return () => clearTimeout(timer)
    }
  }, [isAnimated])

  const dx = to.x - from.x
  const dy = to.y - from.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  const unitX = dx / distance
  const unitY = dy / distance

  const startX = from.x + unitX * nodeRadius
  const startY = from.y + unitY * nodeRadius
  const endX = to.x - unitX * nodeRadius
  const endY = to.y - unitY * nodeRadius

  return (
    <line
      x1={startX}
      y1={startY}
      x2={endX}
      y2={endY}
      stroke="rgb(75 85 99)"
      strokeWidth="3"
      className={`transition-all duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{
        strokeDasharray: isAnimated ? "5 5" : "none",
        strokeDashoffset: isAnimated ? "10" : "0",
        animation: isAnimated ? "dash 1s linear infinite" : "none",
        filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
      }}
    />
  )
}
