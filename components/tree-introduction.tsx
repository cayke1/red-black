"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Info, ChevronDown, BookOpen } from "lucide-react"
import { useState } from "react"

export function TreeIntroduction() {
  const [isRulesOpen, setIsRulesOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">Árvore Rubro-Negra</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Uma árvore binária de busca balanceada onde cada nó tem uma cor: vermelho ou preto.
            </p>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Vermelho
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                Preto
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <Collapsible open={isRulesOpen} onOpenChange={setIsRulesOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left cursor-pointer">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="font-semibold">Regras da Árvore</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isRulesOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                <span>A raiz é sempre preta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                <span>Nós vermelhos têm filhos pretos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                <span>Todos os caminhos da raiz às folhas têm o mesmo número de nós pretos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                <span>Folhas (NIL) são consideradas pretas</span>
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </Card>

    </div>
  )
}
