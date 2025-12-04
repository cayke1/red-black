"use client"

import { useEffect, useState } from "react"
import { NodeColor, type TreeNode as RedBlackTreeNode } from "@/lib/red-black-tree"

interface TreeNodeProps {
  node: RedBlackTreeNode
  x: number
  y: number
  isHighlighted?: boolean
  animationType?: "insert" | "delete" | "recolor" | "move" | null
}

export function TreeNode({ node, x, y, isHighlighted = false, animationType = null }: TreeNodeProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [previousColor, setPreviousColor] = useState(node.color)
  const nodeRadius = 20
  const isRed = node.color === NodeColor.RED

  useEffect(() => {
    if (animationType) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [animationType])

  useEffect(() => {
    if (previousColor !== node.color) {
      setPreviousColor(node.color)
    }
  }, [node.color, previousColor])

  const getAnimationClass = () => {
    if (!isAnimating) return ""
    switch (animationType) {
      case "insert":
        return "animate-node-insert"
      case "delete":
        return "animate-node-delete"
      case "recolor":
        return "animate-node-recolor"
      case "move":
        return "animate-node-move"
      default:
        return ""
    }
  }

  return (
    <g
      className={`transition-all duration-500 ease-in-out ${getAnimationClass()} ${
        isHighlighted ? "animate-pulse" : ""
      }`}
      style={{
        transformOrigin: `${x}px ${y}px`,
      }}
    >
      
      <circle
        cx={x + 2}
        cy={y + 2}
        r={nodeRadius}
        fill="rgba(0, 0, 0, 0.15)"
        className="transition-all duration-500 ease-in-out"
      />

      <circle
        cx={x}
        cy={y}
        r={nodeRadius}
        fill={isRed ? "rgb(239 68 68)" : "rgb(55 65 81)"}
        stroke="rgb(156 163 175)"
        strokeWidth={1}
        className="transition-all duration-500 ease-in-out"
        style={{
          filter: isAnimating ? "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" : "none",
        }}
      />

      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        className="select-none font-mono transition-all duration-300"
        style={{
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
        }}
      >
        {node.value}
      </text>

      {isHighlighted && (
        <circle
          cx={x}
          cy={y}
          r={nodeRadius + 8}
          fill="none"
          stroke="rgb(59 130 246)"
          strokeWidth="2"
          strokeDasharray="6 6"
          className="animate-pulse"
          style={{
            opacity: 0.7,
          }}
        />
      )}

      {animationType === "insert" && isAnimating && (
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill="none"
          stroke="rgb(34 197 94)"
          strokeWidth="3"
          className="animate-ping"
          style={{
            animationDuration: "0.6s",
          }}
        />
      )}
    </g>
  )
}
