import { RedBlackTree } from "@/lib/red-black-tree"
import { validateRBTree } from "./validators"

/**
 * Gera um array de números aleatórios únicos.
 * @param size - Tamanho do array
 * @param max - Valor máximo (inclusive)
 * @returns Array de números únicos
 */
export function generateRandomArray(size: number, max: number): number[] {
  const values: number[] = []
  const used = new Set<number>()

  while (values.length < size) {
    const value = Math.floor(Math.random() * max) + 1
    if (!used.has(value)) {
      used.add(value)
      values.push(value)
    }
  }

  return values
}

/**
 * Executa testes aleatórios na Red-Black Tree.
 * Limpa a árvore antes de cada rodada, insere valores um por vez,
 * e valida após cada inserção.
 * 
 * @param tree - Instância da Red-Black Tree
 * @param iterations - Número de iterações de teste
 */
export function runRandomTests(tree: RedBlackTree, iterations: number): void {
  console.log(`\n🚀 Iniciando ${iterations} testes aleatórios...\n`)

  for (let i = 1; i <= iterations; i++) {
    // Limpar árvore antes de cada rodada
    tree.reset()

    // Gerar array aleatório (tamanho entre 10 e 50, valores até 1000)
    const size = Math.floor(Math.random() * 41) + 10 // 10 a 50
    const max = 1000
    const values = generateRandomArray(size, max)

    console.log(`Teste ${i}/${iterations}: Inserindo ${values.length} valores...`)

    let lastInsertedValue: number | null = null
    try {
      // Inserir cada valor um por vez e validar após cada inserção
      for (let j = 0; j < values.length; j++) {
        const value = values[j]
        lastInsertedValue = value
        tree.insert(value)

        // Validar após cada inserção
        validateRBTree(tree.getRoot())
      }

      // Validação final
      validateRBTree(tree.getRoot())
      console.log(`  ✅ Teste ${i} passou: ${values.length} inserções válidas`)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`\n❌ ERRO no teste ${i}/${iterations}`)
      console.error(`   Valores que seriam inseridos: ${values.join(', ')}`)
      console.error(`   Último valor inserido antes do erro: ${lastInsertedValue !== null ? lastInsertedValue : 'nenhum'}`)
      console.error(`   Erro: ${errorMessage}\n`)
      throw error
    }
  }

  console.log(`\n✅ Todos os ${iterations} testes passaram com sucesso!\n`)
}

