"use client"

import { useState, useCallback, useRef } from "react"
import { RedBlackTree, type TreeStep, type TreeNode } from "@/lib/red-black-tree"
import { useSequenceStorage } from "./use-sequence-storage"

export function useRedBlackTree() {
  const treeRef = useRef(new RedBlackTree())
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<TreeStep[]>(() => treeRef.current.getSteps())
  const { saveSequence } = useSequenceStorage()

  const insertValue = useCallback((value: number) => {
    treeRef.current.insert(value)
    const newSteps = treeRef.current.getSteps()
    setSteps([...newSteps])
    setCurrentStep(newSteps.length - 1)
  }, [])

  const deleteValue = useCallback((value: number) => {
    const success = treeRef.current.delete(value)
    if (success) {
      const newSteps = treeRef.current.getSteps()
      setSteps([...newSteps])
      setCurrentStep(newSteps.length - 1)
    }
    return success
  }, [])

  const searchValue = useCallback((value: number) => {
    return treeRef.current.search(value)
  }, [])

  const insertMultipleValues = useCallback((values: number[]) => {
    values.forEach((value) => treeRef.current.insert(value))
    const newSteps = treeRef.current.getSteps()
    setSteps([...newSteps])
    setCurrentStep(newSteps.length - 1)
  }, [])

  const reset = useCallback(() => {
    treeRef.current.reset()
    const newSteps = treeRef.current.getSteps()
    setSteps([...newSteps])
    setCurrentStep(0)
  }, [])

  const generateRandomValues = useCallback((count = 5) => {
    const values = treeRef.current.generateRandomValues(count)
    values.forEach((value) => treeRef.current.insert(value))
    const newSteps = treeRef.current.getSteps()
    setSteps([...newSteps])
    setCurrentStep(newSteps.length - 1)
    return values
  }, [])

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex)
    }
  }, [steps.length])

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep, steps.length])

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const getCurrentTree = useCallback((): TreeNode | null => {
    return treeRef.current.getTreeAtStep(currentStep)
  }, [currentStep])

  const getCurrentStep = useCallback((): TreeStep | null => {
    return steps[currentStep] || null
  }, [steps, currentStep])

  const getNodePositions = useCallback(() => {
    const currentTree = getCurrentTree()
    return treeRef.current.calculateNodePositions(currentTree)
  }, [getCurrentTree])

  const loadSequence = useCallback((operations: Array<{type: 'insert' | 'delete', value: number}>) => {
    treeRef.current.reset()
    setCurrentStep(0)
    
    operations.forEach((operation) => {
      if (operation.type === "insert") {
        treeRef.current.insert(operation.value)
      } else if (operation.type === "delete") {
        treeRef.current.delete(operation.value)
      }
    })
    
    const newSteps = treeRef.current.getSteps()
    setSteps([...newSteps])
    setCurrentStep(newSteps.length - 1)
  }, [])

  const saveCurrentSequence = useCallback((name: string, description?: string) => {
    return saveSequence(name, steps, description)
  }, [saveSequence, steps])

  return {
    insertValue,
    deleteValue,
    searchValue,
    insertMultipleValues,
    reset,
    generateRandomValues,
    goToStep,
    nextStep,
    previousStep,
    getCurrentTree,
    getCurrentStep,
    getNodePositions,
    loadSequence,
    saveCurrentSequence,
    currentStep,
    totalSteps: steps.length,
    steps,
    canGoNext: currentStep < steps.length - 1,
    canGoPrevious: currentStep > 0,
  }
}
