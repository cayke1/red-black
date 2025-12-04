import { TreeNode, NodeColor } from "@/lib/red-black-tree"

/**
 * Converte uma Red-Black Tree para o formato DOT (Graphviz).
 * 
 * @param root - Raiz da árvore
 * @returns String no formato DOT
 */
export function treeToDot(root: TreeNode | null): string {
  if (!root) {
    return `digraph RBTree {
  node [shape=circle, style=filled];
  label="Árvore vazia";
}`
  }

  const lines: string[] = []
  const nodeIds = new Map<TreeNode, string>()
  let nodeCounter = 0

  // Função para obter ou criar ID único para o nó
  const getNodeId = (node: TreeNode): string => {
    if (!nodeIds.has(node)) {
      nodeIds.set(node, `node${nodeCounter++}`)
    }
    return nodeIds.get(node)!
  }

  // Função recursiva para processar nós
  const processNode = (node: TreeNode | null): void => {
    if (!node) return

    const nodeId = getNodeId(node)
    const color = node.color === NodeColor.RED ? "red" : "black"
    const fillColor = node.color === NodeColor.RED ? "#ffcccc" : "#cccccc"
    const fontColor = node.color === NodeColor.RED ? "black" : "white"

    // Definir nó com label e cor
    lines.push(`  ${nodeId} [label="${node.value}\\n(${color})", fillcolor="${fillColor}", fontcolor="${fontColor}"];`)

    // Processar filhos
    if (node.left) {
      processNode(node.left)
      lines.push(`  ${nodeId} -> ${getNodeId(node.left)};`)
    } else {
      // Criar nó null invisível para manter estrutura
      const nullId = `null${nodeCounter++}`
      lines.push(`  ${nullId} [shape=point, style=invis];`)
      lines.push(`  ${nodeId} -> ${nullId} [style=invis];`)
    }

    if (node.right) {
      processNode(node.right)
      lines.push(`  ${nodeId} -> ${getNodeId(node.right)};`)
    } else {
      // Criar nó null invisível para manter estrutura
      const nullId = `null${nodeCounter++}`
      lines.push(`  ${nullId} [shape=point, style=invis];`)
      lines.push(`  ${nodeId} -> ${nullId} [style=invis];`)
    }
  }

  // Processar árvore
  processNode(root)

  // Montar string final
  return `digraph RBTree {
  node [shape=circle, style=filled];
  edge [color=black];
  
${lines.join('\n')}
}`
}

