"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  Save, 
  FolderOpen,
  Trash2, 
  Copy, 
  Edit, 
  ChevronDown,
  History,
  Calendar,
  FileText
} from "lucide-react"
import { useSequenceStorage } from "@/hooks/use-sequence-storage"
import type { TreeStep } from "@/lib/red-black-tree"

interface SequenceManagerProps {
  currentSteps: TreeStep[]
  onLoadSequence: (operations: Array<{type: 'insert' | 'delete', value: number}>) => void
}

export function SequenceManager({ currentSteps, onLoadSequence }: SequenceManagerProps) {
  const {
    savedSequences,
    isLoading,
    saveSequence,
    updateSequence,
    deleteSequence,
    loadSequence,
    duplicateSequence,
    clearAllSequences
  } = useSequenceStorage()

  const [isOpen, setIsOpen] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSequence, setEditingSequence] = useState<string | null>(null)
  const [saveForm, setSaveForm] = useState({ name: "", description: "" })
  const [editForm, setEditForm] = useState({ name: "", description: "", numbers: "" })

  const handleSave = () => {
    if (saveForm.name.trim()) {
      saveSequence(saveForm.name.trim(), currentSteps, saveForm.description.trim() || undefined)
      setSaveForm({ name: "", description: "" })
      setIsSaveDialogOpen(false)
    }
  }

  const handleEdit = (sequenceId: string) => {
    const sequence = loadSequence(sequenceId)
    if (sequence) {
      const numbers = sequence.operations
        .map(op => op.value)
        .join(", ")
      
      setEditingSequence(sequenceId)
      setEditForm({ 
        name: sequence.name, 
        description: sequence.description || "",
        numbers: numbers
      })
      setIsEditDialogOpen(true)
    }
  }

  const handleUpdate = () => {
    if (editingSequence && editForm.name.trim()) {
      // Processar os números inseridos
      const numbers = editForm.numbers
        .split(/[,\s]+/)
        .map(n => n.trim())
        .filter(n => n !== "")
        .map(n => Number.parseInt(n))
        .filter(n => !isNaN(n))
      
      // Criar novas operações baseadas nos números
      const newOperations = numbers.map(value => ({
        type: 'insert' as const,
        value,
        description: `Inserido nó ${value}`
      }))
      
      updateSequence(editingSequence, {
        name: editForm.name.trim(),
        description: editForm.description.trim() || undefined,
        operations: newOperations
      })
      setEditingSequence(null)
      setEditForm({ name: "", description: "", numbers: "" })
      setIsEditDialogOpen(false)
    }
  }

  const handleLoad = (sequenceId: string) => {
    const sequence = loadSequence(sequenceId)
    if (sequence) {
      onLoadSequence(sequence.operations)
      setIsOpen(false)
    }
  }

  const handleDuplicate = (sequenceId: string) => {
    const sequence = loadSequence(sequenceId)
    if (sequence) {
      duplicateSequence(sequenceId, `${sequence.name} (Cópia)`)
    }
  }

  const handleDelete = (sequenceId: string) => {
    deleteSequence(sequenceId)
  }


  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Carregando sequências...</div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left cursor-pointer">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span className="font-semibold">Gerenciar Sequências</span>
            <Badge variant="outline">{savedSequences.length}</Badge>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center justify-center gap-1 flex-1 cursor-pointer">
                    <Save className="w-3 h-3" />
                    Salvar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Salvar Sequência</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Salve a sequência atual de operações para reutilizar posteriormente.
                    </p>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nome da sequência</label>
                      <Input
                        value={saveForm.name}
                        onChange={(e) => setSaveForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Inserção de números pares"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Descrição (opcional)</label>
                      <Textarea
                        value={saveForm.description}
                        onChange={(e) => setSaveForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva o que esta sequência faz..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)} className="cursor-pointer">
                        Cancelar
                      </Button>
                      <Button onClick={handleSave} disabled={!saveForm.name.trim()} className="cursor-pointer">
                        Salvar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

            </div>

            {savedSequences.length > 0 ? (
              <ScrollArea className="h-64 [&>[data-radix-scroll-area-scrollbar]]:hidden">
                <div className="space-y-2">
                  {savedSequences.map((sequence) => (
                    <div
                      key={sequence.id}
                      className="p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{sequence.name}</h4>
                          {sequence.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {sequence.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Badge variant="outline" className="text-xs">
                            {sequence.operations.length} operações
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(sequence.createdAt)}
                        </div>
                        {sequence.updatedAt.getTime() !== sequence.createdAt.getTime() && (
                          <div className="flex items-center gap-1">
                            <Edit className="w-3 h-3" />
                            Editado
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(sequence.id)}
                            className="text-xs h-7 flex-1 flex items-center justify-center cursor-pointer"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDuplicate(sequence.id)}
                            className="text-xs h-7 flex-1 flex items-center justify-center cursor-pointer"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Duplicar
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLoad(sequence.id)}
                            className="text-xs h-7 flex-1 flex items-center justify-center cursor-pointer"
                          >
                            <FolderOpen className="w-3 h-3 mr-1" />
                            Importar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive" className="text-xs h-7 flex-1 flex items-center justify-center cursor-pointer">
                                <Trash2 className="w-3 h-3 mr-1" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a sequência "{sequence.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(sequence.id)} className="cursor-pointer">
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma sequência salva ainda</p>
                <p className="text-xs">Salve sua primeira sequência para começar</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sequência</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Edite o nome, sequência de números e descrição da sequência selecionada.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome da sequência</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Inserção de números pares"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sequência de números</label>
              <Input
                value={editForm.numbers}
                onChange={(e) => setEditForm(prev => ({ ...prev, numbers: e.target.value }))}
                placeholder="Ex: 10, 20, 30, 40"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separe os números por vírgula ou espaço
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Descrição (opcional)</label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o que esta sequência faz..."
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="cursor-pointer">
                Cancelar
              </Button>
              <Button onClick={handleUpdate} disabled={!editForm.name.trim()} className="cursor-pointer">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
