"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TreeNode } from "@/lib/red-black-tree"
import { NodeColor } from "@/lib/red-black-tree"

interface TreeStatisticsProps {
  tree: TreeNode | null
}

export function TreeStatistics({ tree }: TreeStatisticsProps) {
  const calculateStats = (node: TreeNode | null) => {
    if (!node) {
      return {
        totalNodes: 0,
        redNodes: 0,
        blackNodes: 0,
        height: 0,
        blackHeight: 0,
        isValid: true,
        violations: [],
      }
    }

    let totalNodes = 0
    let redNodes = 0
    let blackNodes = 0
    let maxHeight = 0
    let isValid = true
    let blackHeight = -1
    let violations: string[] = []

    const traverse = (n: TreeNode | null, depth: number, currentBlackHeight: number): number => {
      if (!n) {
        if (blackHeight === -1) {
          blackHeight = currentBlackHeight
        } else if (blackHeight !== currentBlackHeight) {
          isValid = false
          violations.push(`Altura preta inconsistente: esperado ${blackHeight}, encontrado ${currentBlackHeight}`)
        }
        return currentBlackHeight
      }

      totalNodes++
      maxHeight = Math.max(maxHeight, depth)

      if (n.color === NodeColor.RED) {
        redNodes++
        if (n.parent && n.parent.color === NodeColor.RED) {
          isValid = false
          violations.push(`Nó vermelho ${n.value} tem pai vermelho ${n.parent.value}`)
        }
      } else {
        blackNodes++
        currentBlackHeight++
      }

      const leftBlackHeight = traverse(n.left, depth + 1, currentBlackHeight)
      const rightBlackHeight = traverse(n.right, depth + 1, currentBlackHeight)

      if (leftBlackHeight !== rightBlackHeight) {
        isValid = false
        violations.push(`Alturas pretas diferentes: esquerda ${leftBlackHeight}, direita ${rightBlackHeight}`)
      }

      return leftBlackHeight > rightBlackHeight ? leftBlackHeight : rightBlackHeight
    }

    traverse(node, 0, 0)

    if (node.color !== NodeColor.BLACK) {
      isValid = false
      violations.push(`Raiz deve ser preta, mas é ${node.color}`)
    }

    return {
      totalNodes,
      redNodes,
      blackNodes,
      height: maxHeight,
      blackHeight,
      isValid,
      violations,
    }
  }

  const stats = calculateStats(tree)

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Estatísticas da Árvore</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="text-lg font-bold text-foreground">{stats.totalNodes}</div>
            <div className="text-xs text-muted-foreground">Total de Nós</div>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="text-lg font-bold text-foreground">{stats.height}</div>
            <div className="text-xs text-muted-foreground">Altura</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-lg font-bold text-red-700">{stats.redNodes}</div>
            <div className="text-xs text-red-600">Nós Vermelhos</div>
          </div>
          <div className="text-center p-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-lg font-bold text-gray-700">{stats.blackNodes}</div>
            <div className="text-xs text-gray-600">Nós Pretos</div>
          </div>
        </div>

        <div className="text-center p-2 bg-muted rounded-lg">
          <div className="text-lg font-bold text-foreground">{stats.blackHeight}</div>
          <div className="text-xs text-muted-foreground">Altura Preta</div>
        </div>

        <div className="flex justify-center">
          <Badge variant={stats.isValid ? "default" : "destructive"}>
            {stats.isValid ? "✓ Árvore Válida" : "✗ Árvore Inválida"}
          </Badge>
        </div>

        {!stats.isValid && stats.violations.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm font-medium text-red-800 mb-2">Violações encontradas:</div>
            <ul className="text-xs text-red-700 space-y-1">
              {stats.violations.map((violation, index) => (
                <li key={index}>• {violation}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}
