import { TreeNode } from "@/lib/red-black-tree"

/**
 * Retorna os valores da árvore em ordem (in-order traversal).
 * Esquerda -> Raiz -> Direita
 */
export function getInOrder(root: TreeNode | null): number[] {
  const result: number[] = []

  const traverse = (node: TreeNode | null): void => {
    if (!node) return
    traverse(node.left)
    result.push(node.value)
    traverse(node.right)
  }

  traverse(root)
  return result
}

/**
 * Retorna os valores da árvore em pré-ordem (pre-order traversal).
 * Raiz -> Esquerda -> Direita
 */
export function getPreOrder(root: TreeNode | null): number[] {
  const result: number[] = []

  const traverse = (node: TreeNode | null): void => {
    if (!node) return
    result.push(node.value)
    traverse(node.left)
    traverse(node.right)
  }

  traverse(root)
  return result
}

/**
 * Retorna os valores da árvore em pós-ordem (post-order traversal).
 * Esquerda -> Direita -> Raiz
 */
export function getPostOrder(root: TreeNode | null): number[] {
  const result: number[] = []

  const traverse = (node: TreeNode | null): void => {
    if (!node) return
    traverse(node.left)
    traverse(node.right)
    result.push(node.value)
  }

  traverse(root)
  return result
}

/**
 * Retorna os valores da árvore em nível (level-order traversal / BFS).
 * Nível por nível, da esquerda para a direita
 */
export function getLevelOrder(root: TreeNode | null): number[] {
  const result: number[] = []
  if (!root) return result

  const queue: TreeNode[] = [root]

  while (queue.length > 0) {
    const node = queue.shift()!
    result.push(node.value)

    if (node.left) {
      queue.push(node.left)
    }
    if (node.right) {
      queue.push(node.right)
    }
  }

  return result
}

