"use client"

import { useMemo, useEffect, useState, useRef } from "react"
import { TreeNode as TreeNodeComponent } from "./tree-node"
import { TreeEdge } from "./tree-edge"
import { StepNavigator } from "./step-navigator"
import type { TreeNode, TreeStep } from "@/lib/red-black-tree"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Move } from "lucide-react"

interface TreeVisualizationProps {
  tree: TreeNode | null
  nodePositions: Map<string, { x: number; y: number }>
  affectedNodes?: string[]
  currentStepType?: string
  currentStep?: number
  totalSteps?: number
  canGoNext?: boolean
  canGoPrevious?: boolean
  onNextStep?: () => void
  onPreviousStep?: () => void
  onGoToStep?: (step: number) => void
  onReset?: () => void
  currentStepData?: TreeStep | null
  onCenterView?: () => void
}

export function TreeVisualization({
  tree,
  nodePositions,
  affectedNodes = [],
  currentStepType,
  currentStep = 0,
  totalSteps = 0,
  canGoNext = false,
  canGoPrevious = false,
  onNextStep = () => {},
  onPreviousStep = () => {},
  onGoToStep = () => {},
  onReset = () => {},
  currentStepData = null,
  onCenterView,
}: TreeVisualizationProps) {
  const [animatingNodes, setAnimatingNodes] = useState<Set<string>>(new Set())
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set())
  const [previousTree, setPreviousTree] = useState<TreeNode | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
  const [autoCenter, setAutoCenter] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (affectedNodes.length > 0 && currentStepType) {
      setAnimatingNodes(new Set(affectedNodes))
      setHighlightedNodes(new Set(affectedNodes))
      const timer = setTimeout(() => {
        setAnimatingNodes(new Set())
        setHighlightedNodes(new Set())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [affectedNodes, currentStepType])

  useEffect(() => {
    setPreviousTree(tree)
  }, [tree])

  useEffect(() => {
    if (!tree || nodePositions.size === 0) return
    if (!autoCenter) return
    const timer = setTimeout(() => {
      centerView()
      if (onCenterView) onCenterView()
    }, 100)
    return () => clearTimeout(timer)
  }, [tree, nodePositions, onCenterView, autoCenter])

  const handleZoomIn = () => {
    setAutoCenter(false)
    setZoom(prev => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setAutoCenter(false)
    setZoom(prev => Math.max(prev / 1.2, 0.1))
  }

  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setAutoCenter(true)
    // recentra imediatamente após reset
    setTimeout(() => centerView(), 0)
  }

  const centerView = () => {
    if (!tree || nodePositions.size === 0) return

    const bounds = Array.from(nodePositions.values()).reduce(
      (acc, pos) => ({
        minX: Math.min(acc.minX, pos.x),
        maxX: Math.max(acc.maxX, pos.x),
        minY: Math.min(acc.minY, pos.y),
        maxY: Math.max(acc.maxY, pos.y),
      }),
      {
        minX: Number.POSITIVE_INFINITY,
        maxX: Number.NEGATIVE_INFINITY,
        minY: Number.POSITIVE_INFINITY,
        maxY: Number.NEGATIVE_INFINITY,
      },
    )

    const centerX = (bounds.minX + bounds.maxX) / 2
    const centerY = (bounds.minY + bounds.maxY) / 2
    const width = bounds.maxX - bounds.minX
    const height = bounds.maxY - bounds.minY

    const containerWidth = containerRef.current?.clientWidth ?? 800
    const containerHeight = containerRef.current?.clientHeight ?? 500
    const margin = 100
    
    const zoomX = (containerWidth - margin) / width
    const zoomY = (containerHeight - margin) / height
    const newZoom = Math.min(zoomX, zoomY, 1)
    const newPanX = (containerWidth / 2) - (centerX * newZoom)
    const newPanY = (containerHeight / 2) - (centerY * newZoom)

    setZoom(newZoom)
    setPan({ x: newPanX, y: newPanY })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true)
      setLastPanPoint({ x: e.clientX, y: e.clientY })
      setAutoCenter(false)
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x
      const deltaY = e.clientY - lastPanPoint.y
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      setLastPanPoint({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAutoCenter(false)
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.max(0.1, Math.min(3, prev * delta)))
  }


  const { nodes, edges, newNodes } = useMemo(() => {
    if (!tree) return { nodes: [], edges: [], newNodes: new Set<string>() }
    
    const nodeList: TreeNode[] = []
    const edgeList: Array<{ from: TreeNode; to: TreeNode; isNew?: boolean }> = []
    const newNodeSet = new Set<string>()

    const traverse = (node: TreeNode | null) => {
      if (!node) return

      nodeList.push(node)

      if (node.left) {
        edgeList.push({
          from: node,
          to: node.left,
          isNew: false,
        })
        traverse(node.left)
      }

      if (node.right) {
        edgeList.push({
          from: node,
          to: node.right,
          isNew: false,
        })
        traverse(node.right)
      }
    }

    traverse(tree)

    return { nodes: nodeList, edges: edgeList, newNodes: newNodeSet }
  }, [tree])

  if (!tree) {
    return (
      <div className="flex flex-col h-[72vh] min-h-[420px]">
        <div className="relative overflow-hidden flex-1 bg-gradient-to-br from-card to-muted/10 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
          <div className="text-center text-muted-foreground">
            <div className="mb-4">
              <div className="flex justify-center space-x-1">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
            <p className="text-lg font-medium">Visualização da Árvore</p>
            <p className="text-sm">A árvore aparecerá aqui quando você inserir valores</p>
          </div>
        </div>
      </div>
    )
  }

  const bounds = Array.from(nodePositions.values()).reduce(
    (acc, pos) => ({
      minX: Math.min(acc.minX, pos.x),
      maxX: Math.max(acc.maxX, pos.x),
      minY: Math.min(acc.minY, pos.y),
      maxY: Math.max(acc.maxY, pos.y),
    }),
    {
      minX: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    },
  )

  const padding = 80
  const svgWidth = Math.max(500, bounds.maxX - bounds.minX + padding * 2)
  const svgHeight = Math.max(400, bounds.maxY - bounds.minY + padding * 2)
  const offsetX = -bounds.minX + padding
  const offsetY = -bounds.minY + padding

  const getAnimationType = (nodeId: string) => {
    if (newNodes.has(nodeId)) return "insert"
    if (animatingNodes.has(nodeId)) {
      switch (currentStepType) {
        case "delete":
          return "delete"
        case "recolor":
          return "recolor"
        case "rotate-left":
        case "rotate-right":
          return "move"
        default:
          return null
      }
    }
    return null
  }

  return (
    <div className="flex flex-col h-[72vh] min-h-[420px]">
      <div 
        ref={containerRef}
        className={`relative overflow-hidden flex-1 bg-gradient-to-br from-card to-muted/10 ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          <Button size="sm" variant="outline" onClick={handleZoomIn} className="cursor-pointer">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleZoomOut} className="cursor-pointer">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleResetView} className="cursor-pointer">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

      <svg 
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="block"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
          <defs>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(107 114 128)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="rgb(156 163 175)" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {edges.map((edge, index) => {
            const fromPos = nodePositions.get(edge.from.id)
            const toPos = nodePositions.get(edge.to.id)

            if (!fromPos || !toPos) {
              return null
            }


            return (
              <TreeEdge
                key={`edge-${edge.from.id}-${edge.to.id}`}
                from={{
                  x: fromPos.x + offsetX,
                  y: fromPos.y + offsetY,
                }}
                to={{
                  x: toPos.x + offsetX,
                  y: toPos.y + offsetY,
                }}
                isAnimated={edge.isNew}
              />
            )
          })}

          {nodes.map((node) => {
            const position = nodePositions.get(node.id)
            if (!position) return null

            return (
              <TreeNodeComponent
                key={node.id}
                node={node}
                x={position.x + offsetX}
                y={position.y + offsetY}
                isHighlighted={highlightedNodes.has(node.id)}
                animationType={getAnimationType(node.id)}
              />
            )
          })}
        </svg>
      </div>
      
      {totalSteps > 0 && (
        <div className="p-4 *:bg-card">
          <StepNavigator
            currentStep={currentStep}
            totalSteps={totalSteps}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            onNextStep={onNextStep}
            onPreviousStep={onPreviousStep}
            onGoToStep={onGoToStep}
            onReset={onReset}
            currentStepData={currentStepData}
          />
        </div>
      )}
    </div>
  )
}
