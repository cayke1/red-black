import { RedBlackTree } from "@/lib/red-black-tree"
import { runRandomTests } from "./random"
import { getInOrder, getPreOrder, getPostOrder, getLevelOrder } from "./traversals"
import { treeToDot } from "./dot"
import * as fs from "fs"
import * as path from "path"

/**
 * CLI principal para executar testes automatizados da Red-Black Tree
 */
function main() {
  console.log("=".repeat(60))
  console.log("  Red-Black Tree Automated Tester")
  console.log("=".repeat(60))

  // Criar instância da árvore
  const tree = new RedBlackTree()

  // Executar testes aleatórios
  try {
    runRandomTests(tree, 1000)
  } catch (error) {
    console.error("\n❌ Testes falharam. Abortando geração de arquivos.")
    process.exit(1)
  }

  // Obter raiz da árvore final
  const root = tree.getRoot()

  // Criar pasta out/ se não existir
  const outDir = path.join(process.cwd(), "out")
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
    console.log(`📁 Pasta 'out/' criada`)
  }

  // Gerar arquivo DOT
  const dotContent = treeToDot(root)
  const dotPath = path.join(outDir, "tree.dot")
  fs.writeFileSync(dotPath, dotContent, "utf-8")
  console.log(`📄 Arquivo DOT gerado: ${dotPath}`)

  // Gerar arquivo JSON com travessias
  const traversals = {
    inOrder: getInOrder(root),
    preOrder: getPreOrder(root),
    postOrder: getPostOrder(root),
    levelOrder: getLevelOrder(root),
    nodeCount: getInOrder(root).length,
    timestamp: new Date().toISOString(),
  }

  const jsonPath = path.join(outDir, "traversals.json")
  fs.writeFileSync(jsonPath, JSON.stringify(traversals, null, 2), "utf-8")
  console.log(`📄 Arquivo JSON gerado: ${jsonPath}`)

  console.log("\n✅ Processo concluído com sucesso!")
  console.log("=".repeat(60))
}

// Executar CLI
main()

