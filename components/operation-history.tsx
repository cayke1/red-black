"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { History, ChevronDown } from "lucide-react"
import type { TreeStep } from "@/lib/red-black-tree"

interface OperationHistoryProps {
  steps: TreeStep[]
  currentStep: number
  onGoToStep: (step: number) => void
}

export function OperationHistory({ steps, currentStep, onGoToStep }: OperationHistoryProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case "insert":
        return "bg-green-100 text-green-800 border-green-200 text-xs"
      case "delete":
        return "bg-red-100 text-red-800 border-red-200 text-xs"
      case "recolor":
        return "bg-blue-100 text-blue-800 border-blue-200 text-xs"
      case "rotate-left":
      case "rotate-right":
        return "bg-purple-100 text-purple-800 border-purple-200 text-xs"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 text-xs"
    }
  }

  const getStepTypeLabel = (type: string) => {
    switch (type) {
      case "insert":
        return "Inserção"
      case "delete":
        return "Remoção"
      case "recolor":
        return "Recoloração"
      case "rotate-left":
        return "Rotação ←"
      case "rotate-right":
        return "Rotação →"
      case "initial":
        return "Inicial"
      default:
        return type
    }
  }



  return (
    <Card className="p-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left cursor-pointer">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span className="font-semibold">Histórico</span>
            <Badge variant="outline">{steps.length}</Badge>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-3">
          <div className="space-y-4">

             <ScrollArea className="h-64 [&>[data-radix-scroll-area-scrollbar]]:hidden">
               <div className="space-y-2 pb-2 grid grid-cols-1">
                 {steps.map((step, index) => (
                   <div
                     key={step.id}
                     className={`w-full p-2 rounded-md cursor-pointer transition-colors border ${
                       index === currentStep
                         ? "bg-blue-50 border-blue-300 text-blue-900"
                         : "hover:bg-muted border-border"
                     }`}
                     onClick={() => onGoToStep(index)}
                   >
                     <div className="flex items-center gap-1 mb-1 flex-wrap">
                       <Badge variant="outline" className="w-5 h-5 flex items-center justify-center p-0 text-xs shrink-0">
                         {index + 1}
                       </Badge>
                       <Badge className={`${getStepTypeColor(step.type)} shrink-0`}>
                         {getStepTypeLabel(step.type)}
                       </Badge>
                       {index === currentStep && (
                         <Badge variant="secondary" className="text-xs shrink-0">Atual</Badge>
                       )}
                     </div>
                     <p className="text-xs text-muted-foreground leading-tight">
                       {step.description}
                     </p>
                   </div>
                 ))}
               </div>
             </ScrollArea>

          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
