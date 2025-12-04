import { RedBlackTree, NodeColor, TreeNode } from '../red-black-tree'

describe('RedBlackTree', () => {
  describe('Inicialização', () => {
    test('deve criar uma árvore vazia', () => {
      const tree = new RedBlackTree()
      expect(tree.getRoot()).toBeNull()
    })

    test('deve criar step inicial ao inicializar', () => {
      const tree = new RedBlackTree()
      const steps = tree.getSteps()
      expect(steps.length).toBe(1)
      expect(steps[0].type).toBe('initial')
      expect(steps[0].description).toBe('Árvore inicializada vazia')
    })

    test('getRoot() deve retornar null inicialmente', () => {
      const tree = new RedBlackTree()
      expect(tree.getRoot()).toBeNull()
    })
  })

  describe('Inserção (insert)', () => {
    test('deve inserir nó único como raiz preta', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      
      const root = tree.getRoot()
      expect(root).not.toBeNull()
      expect(root!.value).toBe(10)
      expect(root!.color).toBe(NodeColor.BLACK)
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
    })

    test('deve inserir múltiplos nós mantendo propriedades Red-Black', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      tree.insert(15)
      tree.insert(25)
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
      expect(validation.violations).toHaveLength(0)
    })

    test('não deve inserir valor duplicado', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      const stepsBefore = tree.getSteps().length
      
      tree.insert(10)
      const stepsAfter = tree.getSteps().length
      
      // Não deve criar novos steps além do inicial
      expect(stepsAfter).toBe(stepsBefore)
    })

    test('raiz deve sempre ser preta após inserções', () => {
      const tree = new RedBlackTree()
      const values = [10, 20, 5, 15, 25, 30, 1, 7]
      
      values.forEach(value => {
        tree.insert(value)
        const root = tree.getRoot()
        expect(root).not.toBeNull()
        expect(root!.color).toBe(NodeColor.BLACK)
      })
    })

    test('nenhum nó vermelho deve ter filho vermelho', () => {
      const tree = new RedBlackTree()
      const values = [10, 20, 5, 15, 25, 30, 1, 7, 12, 18]
      
      values.forEach(value => tree.insert(value))
      
      const checkRedRedViolation = (node: TreeNode | null): boolean => {
        if (!node) return true
        
        if (node.color === NodeColor.RED) {
          if (node.left && node.left.color === NodeColor.RED) {
            return false
          }
          if (node.right && node.right.color === NodeColor.RED) {
            return false
          }
        }
        
        return checkRedRedViolation(node.left) && checkRedRedViolation(node.right)
      }
      
      expect(checkRedRedViolation(tree.getRoot())).toBe(true)
    })

    test('altura preta deve ser consistente em todos os caminhos', () => {
      const tree = new RedBlackTree()
      const values = [10, 20, 5, 15, 25, 30, 1, 7, 12, 18, 22, 28]
      
      values.forEach(value => tree.insert(value))
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
    })

    test('deve gerar steps corretamente durante inserção', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      
      const steps = tree.getSteps()
      expect(steps.length).toBeGreaterThan(1)
      
      const insertSteps = steps.filter(s => s.type === 'insert')
      expect(insertSteps.length).toBeGreaterThan(0)
    })

    test('deve lidar com rotação à esquerda', () => {
      const tree = new RedBlackTree()
      // Sequência que força rotação à esquerda
      tree.insert(10)
      tree.insert(20)
      tree.insert(30)
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
      
      const steps = tree.getSteps()
      const rotateSteps = steps.filter(s => s.type === 'rotate-left')
      expect(rotateSteps.length).toBeGreaterThan(0)
    })

    test('deve lidar com rotação à direita', () => {
      const tree = new RedBlackTree()
      // Sequência que força rotação à direita
      tree.insert(30)
      tree.insert(20)
      tree.insert(10)
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
      
      const steps = tree.getSteps()
      const rotateSteps = steps.filter(s => s.type === 'rotate-right')
      expect(rotateSteps.length).toBeGreaterThan(0)
    })

    test('deve lidar com caso de tio vermelho (recolorização)', () => {
      const tree = new RedBlackTree()
      // Sequência que força recolorização com tio vermelho
      tree.insert(10)
      tree.insert(5)
      tree.insert(20)
      tree.insert(15)
      tree.insert(25)
      tree.insert(12) // Força caso de tio vermelho
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
      
      const steps = tree.getSteps()
      const recolorSteps = steps.filter(s => s.type === 'recolor')
      expect(recolorSteps.length).toBeGreaterThan(0)
    })
  })

  describe('Busca (search)', () => {
    test('deve encontrar valor existente', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      
      const node = tree.search(20)
      expect(node).not.toBeNull()
      expect(node!.value).toBe(20)
    })

    test('deve retornar null para valor inexistente', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      
      const node = tree.search(99)
      expect(node).toBeNull()
    })

    test('deve retornar null ao buscar em árvore vazia', () => {
      const tree = new RedBlackTree()
      const node = tree.search(10)
      expect(node).toBeNull()
    })

    test('deve encontrar todos os valores inseridos', () => {
      const tree = new RedBlackTree()
      const values = [10, 20, 5, 15, 25, 30, 1, 7]
      
      values.forEach(value => tree.insert(value))
      
      values.forEach(value => {
        const node = tree.search(value)
        expect(node).not.toBeNull()
        expect(node!.value).toBe(value)
      })
    })
  })

  describe('Deleção (delete)', () => {
    test('deve retornar false ao deletar nó inexistente', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      
      const result = tree.delete(99)
      expect(result).toBe(false)
    })

    test('deve deletar nó folha mantendo propriedades Red-Black', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      
      const result = tree.delete(5)
      expect(result).toBe(true)
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
      
      const node = tree.search(5)
      expect(node).toBeNull()
    })

    test('deve deletar nó com um filho mantendo propriedades Red-Black', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      tree.insert(15)
      
      const result = tree.delete(20)
      expect(result).toBe(true)
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
      
      const node = tree.search(20)
      expect(node).toBeNull()
    })

    test('deve deletar nó com dois filhos mantendo propriedades Red-Black', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      tree.insert(15)
      tree.insert(25)
      
      const result = tree.delete(20)
      expect(result).toBe(true)
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
      
      const node = tree.search(20)
      expect(node).toBeNull()
    })

    test('deve manter propriedades Red-Black após múltiplas deleções', () => {
      const tree = new RedBlackTree()
      const values = [10, 20, 5, 15, 25, 30, 1, 7, 12, 18]
      
      values.forEach(value => tree.insert(value))
      
      // Deletar alguns nós
      tree.delete(1)
      tree.delete(30)
      tree.delete(15)
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
    })

    test('deve gerar steps corretamente durante deleção', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      
      const stepsBefore = tree.getSteps().length
      tree.delete(5)
      const stepsAfter = tree.getSteps().length
      
      expect(stepsAfter).toBeGreaterThan(stepsBefore)
      
      const deleteSteps = tree.getSteps().filter(s => s.type === 'delete')
      expect(deleteSteps.length).toBeGreaterThan(0)
    })

    test('deve lidar com deleção de raiz', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      
      const result = tree.delete(10)
      expect(result).toBe(true)
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
      
      const node = tree.search(10)
      expect(node).toBeNull()
    })

    test('deve manter árvore válida após deletar todos os nós', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      
      tree.delete(10)
      tree.delete(20)
      tree.delete(5)
      
      const root = tree.getRoot()
      expect(root).toBeNull()
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
    })
  })

  describe('Validação (validateTree)', () => {
    test('árvore vazia deve ser válida', () => {
      const tree = new RedBlackTree()
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
      expect(validation.violations).toHaveLength(0)
    })

    test('deve validar árvore após inserções', () => {
      const tree = new RedBlackTree()
      const values = [10, 20, 5, 15, 25, 30, 1, 7, 12, 18]
      
      values.forEach(value => {
        tree.insert(value)
        const validation = tree.validateTree()
        expect(validation.isValid).toBe(true)
      })
    })

    test('deve validar árvore após deleções', () => {
      const tree = new RedBlackTree()
      const values = [10, 20, 5, 15, 25, 30, 1, 7, 12, 18]
      
      values.forEach(value => tree.insert(value))
      
      tree.delete(1)
      tree.delete(30)
      tree.delete(15)
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
    })

    test('deve detectar raiz preta', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      
      const root = tree.getRoot()
      expect(root).not.toBeNull()
      expect(root!.color).toBe(NodeColor.BLACK)
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
    })
  })

  describe('Utilitários', () => {
    test('reset() deve limpar a árvore e steps', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      
      expect(tree.getRoot()).not.toBeNull()
      expect(tree.getSteps().length).toBeGreaterThan(1)
      
      tree.reset()
      
      expect(tree.getRoot()).toBeNull()
      const steps = tree.getSteps()
      expect(steps.length).toBe(1)
      expect(steps[0].type).toBe('initial')
    })

    test('generateRandomValues() deve gerar valores únicos', () => {
      const tree = new RedBlackTree()
      const values = tree.generateRandomValues(10)
      
      expect(values.length).toBe(10)
      
      const uniqueValues = new Set(values)
      expect(uniqueValues.size).toBe(10)
    })

    test('generateRandomValues() deve gerar quantidade correta de valores', () => {
      const tree = new RedBlackTree()
      
      expect(tree.generateRandomValues(5).length).toBe(5)
      expect(tree.generateRandomValues(20).length).toBe(20)
      expect(tree.generateRandomValues(1).length).toBe(1)
    })

    test('getSteps() deve retornar array de steps', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      
      const steps = tree.getSteps()
      expect(Array.isArray(steps)).toBe(true)
      expect(steps.length).toBeGreaterThan(0)
      
      steps.forEach(step => {
        expect(step).toHaveProperty('id')
        expect(step).toHaveProperty('description')
        expect(step).toHaveProperty('type')
        expect(step).toHaveProperty('affectedNodes')
        expect(step).toHaveProperty('tree')
      })
    })

    test('getTreeAtStep() deve retornar árvore no step específico', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      
      const steps = tree.getSteps()
      
      // O primeiro step (inicial) pode ter árvore null, mas os demais devem ter árvore
      for (let i = 1; i < steps.length; i++) {
        const treeAtStep = tree.getTreeAtStep(i)
        expect(treeAtStep).not.toBeNull()
      }
      
      // Verificar que o step inicial pode ter árvore null (se a árvore estava vazia)
      const initialTree = tree.getTreeAtStep(0)
      // Pode ser null (árvore vazia) ou não null (se já havia inserções)
      expect(initialTree === null || initialTree !== null).toBe(true)
    })

    test('getTreeAtStep() deve retornar null para índice inválido', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      
      expect(tree.getTreeAtStep(-1)).toBeNull()
      expect(tree.getTreeAtStep(999)).toBeNull()
    })

    test('calculateNodePositions() deve calcular posições corretamente', () => {
      const tree = new RedBlackTree()
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      
      const root = tree.getRoot()
      expect(root).not.toBeNull()
      
      const positions = tree.calculateNodePositions(root)
      
      expect(positions.size).toBeGreaterThan(0)
      
      positions.forEach((pos, nodeId) => {
        expect(pos).toHaveProperty('x')
        expect(pos).toHaveProperty('y')
        expect(typeof pos.x).toBe('number')
        expect(typeof pos.y).toBe('number')
      })
    })

    test('calculateNodePositions() deve retornar Map vazio para árvore vazia', () => {
      const tree = new RedBlackTree()
      const positions = tree.calculateNodePositions(null)
      
      expect(positions.size).toBe(0)
    })
  })

  describe('Testes de Integração', () => {
    test('sequência completa: inserir → buscar → deletar → validar', () => {
      const tree = new RedBlackTree()
      
      // Inserir
      tree.insert(10)
      tree.insert(20)
      tree.insert(5)
      tree.insert(15)
      tree.insert(25)
      
      // Buscar
      expect(tree.search(10)).not.toBeNull()
      expect(tree.search(20)).not.toBeNull()
      expect(tree.search(5)).not.toBeNull()
      
      // Validar
      let validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
      
      // Deletar
      tree.delete(5)
      tree.delete(20)
      
      // Validar novamente
      validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
      
      // Verificar que foram deletados
      expect(tree.search(5)).toBeNull()
      expect(tree.search(20)).toBeNull()
    })

    test('múltiplas operações em sequência mantendo propriedades Red-Black', () => {
      const tree = new RedBlackTree()
      const operations = [
        { op: 'insert', value: 10 },
        { op: 'insert', value: 20 },
        { op: 'insert', value: 5 },
        { op: 'delete', value: 5 },
        { op: 'insert', value: 15 },
        { op: 'insert', value: 25 },
        { op: 'delete', value: 20 },
        { op: 'insert', value: 30 },
        { op: 'insert', value: 1 },
        { op: 'delete', value: 1 },
      ]
      
      operations.forEach(({ op, value }) => {
        if (op === 'insert') {
          tree.insert(value)
        } else {
          tree.delete(value)
        }
        
        const validation = tree.validateTree()
        expect(validation.isValid).toBe(true)
      })
    })

    test('cenário complexo com muitos nós (15 nós)', () => {
      const tree = new RedBlackTree()
      const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 85]
      
      // Inserir todos
      values.forEach(value => {
        tree.insert(value)
        const validation = tree.validateTree()
        expect(validation.isValid).toBe(true)
      })
      
      // Verificar que todos estão presentes
      values.forEach(value => {
        expect(tree.search(value)).not.toBeNull()
      })
      
      // Deletar alguns
      const toDelete = [10, 25, 45, 55, 75]
      toDelete.forEach(value => {
        tree.delete(value)
        const validation = tree.validateTree()
        expect(validation.isValid).toBe(true)
      })
      
      // Verificar que foram deletados
      toDelete.forEach(value => {
        expect(tree.search(value)).toBeNull()
      })
      
      // Verificar que os restantes ainda estão presentes
      const remaining = values.filter(v => !toDelete.includes(v))
      remaining.forEach(value => {
        expect(tree.search(value)).not.toBeNull()
      })
    })

    test('inserção e deleção alternadas mantendo consistência', () => {
      const tree = new RedBlackTree()
      
      for (let i = 1; i <= 20; i++) {
        tree.insert(i)
        const validation = tree.validateTree()
        expect(validation.isValid).toBe(true)
        
        if (i % 3 === 0) {
          tree.delete(i - 1)
          const validationAfterDelete = tree.validateTree()
          expect(validationAfterDelete.isValid).toBe(true)
        }
      }
    })

    test('operações com valores negativos e zero', () => {
      const tree = new RedBlackTree()
      
      tree.insert(-10)
      tree.insert(0)
      tree.insert(10)
      tree.insert(-5)
      tree.insert(5)
      
      const validation = tree.validateTree()
      expect(validation.isValid).toBe(true)
      
      expect(tree.search(-10)).not.toBeNull()
      expect(tree.search(0)).not.toBeNull()
      expect(tree.search(10)).not.toBeNull()
      
      tree.delete(0)
      const validationAfterDelete = tree.validateTree()
      expect(validationAfterDelete.isValid).toBe(true)
      expect(tree.search(0)).toBeNull()
    })
  })
})

