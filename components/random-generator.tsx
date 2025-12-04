"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Shuffle, ChevronDown, Dice5 } from "lucide-react"

interface RandomGeneratorProps {
  onGenerate: (values: number[]) => void
}

export function RandomGenerator({ onGenerate }: RandomGeneratorProps) {
  const [count, setCount] = useState(5)
  const [showSettings, setShowSettings] = useState(false)

  const handleGenerate = () => {
    const values: number[] = []
    const used = new Set<number>()

    const rangeMin = 1
    const rangeMax = 100

    while (values.length < count && used.size < rangeMax - rangeMin + 1) {
      const value = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin
      if (!used.has(value)) {
        used.add(value)
        values.push(value)
      }
    }

    onGenerate(values)
  }

  const presets = [
    { name: "Pequena", count: 3 },
    { name: "Média", count: 6 },
    { name: "Grande", count: 10 },
    { name: "Desafio", count: 15 },
  ]

  const applyPreset = (preset: (typeof presets)[0]) => {
    setCount(preset.count)
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dice5 className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Gerador Aleatório</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowSettings(!showSettings)} 
          className="cursor-pointer transition-transform hover:bg-transparent hover:text-current active:bg-transparent focus:bg-transparent"
          aria-label={showSettings ? "Recolher" : "Expandir"}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? "rotate-180" : "rotate-0"}`} />
        </Button>
      </div>

      {showSettings && (
        <div className="space-y-4 mb-4 p-3 bg-muted rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="count">Quantidade de valores: {count}</Label>
            <Slider value={[count]} onValueChange={(value) => setCount(value[0])} max={15} min={1} step={1} className="cursor-pointer" />
          </div>

          <div className="space-y-2">
            <Label>Presets:</Label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <Button key={preset.name} variant="outline" size="sm" onClick={() => applyPreset(preset)} className="cursor-pointer">
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button onClick={handleGenerate} className="w-full cursor-pointer">
        <Shuffle className="w-4 h-4 mr-2" />
        Gerar {count} Valores
      </Button>
    </Card>
  )
}
