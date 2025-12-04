import { TreeNode, NodeColor } from "@/lib/red-black-tree"

/**
 * Valida todas as propriedades de uma Red-Black Tree.
 * Lança erro descritivo se qualquer propriedade for violada.
 * 
 * Propriedades validadas:
 * 1. A raiz deve ser preta
 * 2. Todo nó deve ser vermelho ou preto
 * 3. Nó vermelho não pode ter filhos vermelhos
 * 4. Todos os caminhos da raiz até null leaves devem ter a mesma black-height
 * 5. A estrutura deve respeitar a propriedade de BST: left.value < node.value < right.value
 */
export function validateRBTree(root: TreeNode | null): void {
  if (!root) {
    return // Árvore vazia é válida
  }

  const violations: string[] = []

  // Propriedade 1: A raiz deve ser preta
  if (root.color !== NodeColor.BLACK) {
    violations.push(`Propriedade 1 violada: A raiz deve ser preta, mas é ${root.color}`)
  }

  // Propriedade 2 e 3: Todo nó é vermelho ou preto, e nó vermelho não tem filhos vermelhos
  const validateNodeColors = (node: TreeNode | null, path: string = "root"): void => {
    if (!node) return

    // Propriedade 2: Verificar se a cor é válida
    if (node.color !== NodeColor.RED && node.color !== NodeColor.BLACK) {
      violations.push(`Propriedade 2 violada: Nó ${node.value} no caminho ${path} tem cor inválida: ${node.color}`)
    }

    // Propriedade 3: Nó vermelho não pode ter filhos vermelhos
    if (node.color === NodeColor.RED) {
      if (node.left && node.left.color === NodeColor.RED) {
        violations.push(`Propriedade 3 violada: Nó vermelho ${node.value} no caminho ${path} tem filho esquerdo vermelho ${node.left.value}`)
      }
      if (node.right && node.right.color === NodeColor.RED) {
        violations.push(`Propriedade 3 violada: Nó vermelho ${node.value} no caminho ${path} tem filho direito vermelho ${node.right.value}`)
      }
    }

    validateNodeColors(node.left, `${path}->left(${node.left?.value || 'null'})`)
    validateNodeColors(node.right, `${path}->right(${node.right?.value || 'null'})`)
  }

  validateNodeColors(root)

  // Propriedade 4: Black-height consistente
  let expectedBlackHeight: number | null = null

  const calculateBlackHeight = (node: TreeNode | null, blackCount: number, path: string = "root"): number => {
    if (!node) {
      // Chegamos a uma folha null
      if (expectedBlackHeight === null) {
        expectedBlackHeight = blackCount
      } else if (blackCount !== expectedBlackHeight) {
        violations.push(`Propriedade 4 violada: Black-height inconsistente. Esperado ${expectedBlackHeight}, encontrado ${blackCount} no caminho ${path}`)
      }
      return blackCount
    }

    const newBlackCount = node.color === NodeColor.BLACK ? blackCount + 1 : blackCount

    const leftBlackHeight = calculateBlackHeight(node.left, newBlackCount, `${path}->left(${node.left?.value || 'null'})`)
    const rightBlackHeight = calculateBlackHeight(node.right, newBlackCount, `${path}->right(${node.right?.value || 'null'})`)

    // Verificar se as alturas pretas dos filhos são iguais
    if (leftBlackHeight !== rightBlackHeight) {
      violations.push(`Propriedade 4 violada: Nó ${node.value} no caminho ${path} tem black-heights diferentes (esquerda: ${leftBlackHeight}, direita: ${rightBlackHeight})`)
    }

    return leftBlackHeight
  }

  calculateBlackHeight(root, 0)

  // Propriedade 5: Propriedade BST
  const validateBST = (node: TreeNode | null, min: number | null, max: number | null, path: string = "root"): void => {
    if (!node) return

    if (min !== null && node.value <= min) {
      violations.push(`Propriedade 5 violada: Nó ${node.value} no caminho ${path} viola propriedade BST (valor <= ${min})`)
    }

    if (max !== null && node.value >= max) {
      violations.push(`Propriedade 5 violada: Nó ${node.value} no caminho ${path} viola propriedade BST (valor >= ${max})`)
    }

    validateBST(node.left, min, node.value, `${path}->left(${node.left?.value || 'null'})`)
    validateBST(node.right, node.value, max, `${path}->right(${node.right?.value || 'null'})`)
  }

  validateBST(root, null, null)

  // Se houver violações, lançar erro
  if (violations.length > 0) {
    const errorMessage = `Red-Black Tree inválida! ${violations.length} violação(ões) encontrada(s):\n\n${violations.join('\n')}`
    throw new Error(errorMessage)
  }
}

