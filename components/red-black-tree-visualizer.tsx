"use client"

import { forwardRef, useImperativeHandle, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TreeVisualization } from "./tree-visualization"
import { RandomGenerator } from "./random-generator"
import { PresentationMode } from "./presentation-mode"
import { OperationHistory } from "./operation-history"
import { SequenceManager } from "./sequence-manager"
import { TreeStatistics } from "./tree-statistics"
import { useRedBlackTree } from "@/hooks/use-red-black-tree"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Minus,
  RotateCcw,
  Presentation,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Share2,
} from "lucide-react"

import type { TreeNode, TreeStep } from "@/lib/red-black-tree" // ajuste o caminho

// API pública do visualizador — usada por páginas, testes, PresentationMode, etc.
export interface RedBlackTreeVisualizerHandle {
  /** Insere um ou mais valores na árvore (dispara animações completas) */
  insert: (values: number | number[]) => void

  /** Remove um valor da árvore (dispara animações de deleção) */
  remove: (value: number) => boolean

  /** Reseta completamente a árvore e histórico */
  reset: () => void

  /** Vai para um passo específico do histórico */
  goToStep: (stepIndex: number) => void

  /** Retorna os valores atualmente na árvore (em ordem) */
  getCurrentValues: () => number[]

  /** Retorna o estado atual da árvore (útil para exportar/share) */
  getCurrentTree: () => TreeNode | null

  /** Retorna todo o histórico de passos (para salvar, compartilhar, etc) */
  getHistory: () => TreeStep[]
}

type Props = {
  className?: string
}

export const RedBlackTreeVisualizer = forwardRef<RedBlackTreeVisualizerHandle, Props>(
  ({ className }, ref) => {
    const [inputValue, setInputValue] = useState("")
    const [showPresentation, setShowPresentation] = useState(false)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { toast } = useToast()

    const {
      insertMultipleValues,
      deleteValue,
      reset: resetTree,
      nextStep,
      previousStep,
      goToStep: goToStepInternal,
      getCurrentTree,
      getCurrentStep,
      getNodePositions,
      loadSequence,
      currentStep,
      totalSteps,
      steps,
      canGoNext,
      canGoPrevious,
    } = useRedBlackTree()

    // Funções centralizadas e seguras
    const insert = useCallback(
      (values: number | number[]) => {
        const arr = Array.isArray(values) ? values : [values]
        const valid = arr
          .map(Number)
          .filter(n => !isNaN(n) && n != null)

        if (valid.length > 0) {
          insertMultipleValues(valid)
        }
      },
      [insertMultipleValues]
    )

    const remove = useCallback(
      (value: number) => deleteValue(value),
      [deleteValue]
    )

    const getCurrentValues = useCallback(() => {
      const tree = getCurrentTree()
      if (!tree) return []
      const result: number[] = []
      const traverse = (node: TreeNode | null) => {
        if (!node) return
        traverse(node.left)
        result.push(node.value)
        traverse(node.right)
      }
      traverse(tree)
      return result
    }, [getCurrentTree])

    // Expor API pública via ref
    useImperativeHandle(
      ref,
      () => ({
        insert,
        remove,
        reset: resetTree,
        goToStep: goToStepInternal,
        getCurrentValues,
        getCurrentTree,
        getHistory: () => steps,
      }),
      [
        insert,
        remove,
        resetTree,
        goToStepInternal,
        getCurrentValues,
        getCurrentTree,
        steps,
      ]
    )

    // Handlers do input manual
    const handleInsert = () => {
      if (!inputValue.trim()) return
      const values = inputValue
        .split(/[,\s]+/)
        .map(v => parseInt(v.trim(), 10))
        .filter(n => !isNaN(n))
      if (values.length > 0) {
        insert(values)
        setInputValue("")
      }
    }

    const handleDelete = () => {
      const value = parseInt(inputValue, 10)
      if (!isNaN(value)) {
        if (remove(value)) setInputValue("")
      }
    }

    const handleShare = async () => {
      const values = getCurrentValues()
      
      if (values.length === 0) {
        toast({
          title: "Árvore vazia",
          description: "Não há valores para compartilhar. Insira alguns valores primeiro.",
          variant: "destructive",
        })
        return
      }

      try {
        const params = new URLSearchParams()
        params.set("v", values.join(","))
        const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`
        
        await navigator.clipboard.writeText(shareUrl)
        
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência.",
        })
      } catch (error) {
        toast({
          title: "Erro ao compartilhar",
          description: "Não foi possível copiar o link. Tente novamente.",
          variant: "destructive",
        })
      }
    }

    const currentTree = getCurrentTree()
    const currentStepData = getCurrentStep()
    const nodePositions = getNodePositions()


  return (
      <div className={`min-h-screen bg-background ${className || ""}`}>
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Simulador Rubro-Negra</h1>
              <button
                onClick={() => setIsMobileMenuOpen(v => !v)}
                className="lg:hidden"
              >
                {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 lg:px-8 xl:px-12">
          {showPresentation ? (
            <PresentationMode
              onExit={() => setShowPresentation(false)}
              tree={currentTree}
              nodePositions={nodePositions}
              currentStep={currentStep}
              totalSteps={totalSteps}
              steps={steps}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
              nextStep={nextStep}
              previousStep={previousStep}
              goToStep={goToStepInternal}
              reset={resetTree}
              // Permite inserir e remover durante a apresentação!
              onInsert={insert}
              onRemove={remove}
            />
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Área principal */}
              <div className={`flex-1 space-y-6 ${isSidebarCollapsed ? "lg:w-full" : "lg:flex-[3]"}`}>
                {/* Controles */}
                <div className="flex gap-4">
                  <Card className="p-4 flex-1">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex gap-2 flex-1">
                        <Input
                          placeholder="10, 20, 30..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value.replace(/[^0-9,\s-]/g, ""))}
                          onKeyDown={(e) => e.key === "Enter" && handleInsert()}
                        />
                        <Button onClick={handleInsert}>
                          <Plus className="w-4 h-4 mr-2" /> Inserir
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                          <Minus className="w-4 h-4 mr-2" /> Remover
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={resetTree}>
                          <RotateCcw className="w-4 h-4 mr-2" /> Resetar
                        </Button>
                        <Button variant="outline" onClick={handleShare}>
                          <Share2 className="w-4 h-4 mr-2" /> Compartilhar
                        </Button>
                        <Button variant="outline" onClick={() => setShowPresentation(true)}>
                          <Presentation className="w-4 h-4 mr-2" /> Apresentação
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="hidden lg:flex items-center justify-center w-12 cursor-pointer hover:bg-muted/50"
                    onClick={() => setIsSidebarCollapsed(c => !c)}
                  >
                    {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                  </Card>
                </div>

                {/* Árvore */}
                <Card className="p-6">
                  <TreeVisualization
                    tree={currentTree}
                    nodePositions={nodePositions}
                    affectedNodes={currentStepData?.affectedNodes || []}
                    currentStepType={currentStepData?.type}
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    canGoNext={canGoNext}
                    canGoPrevious={canGoPrevious}
                    onNextStep={nextStep}
                    onPreviousStep={previousStep}
                    onGoToStep={goToStepInternal}
                    onReset={resetTree}
                    currentStepData={currentStepData}
                  />
                </Card>
              </div>

              {/* Sidebar */}
              {(!isSidebarCollapsed || typeof window !== "undefined" && window.innerWidth < 1024) && (
                <div className={`${isSidebarCollapsed ? "hidden lg:block" : "block"} lg:w-80 space-y-6`}>
                  <RandomGenerator onGenerate={insert} />
                  <SequenceManager currentSteps={steps} onLoadSequence={loadSequence} />
                  <OperationHistory steps={steps} currentStep={currentStep} onGoToStep={goToStepInternal} />
                  <TreeStatistics tree={currentTree} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
})
