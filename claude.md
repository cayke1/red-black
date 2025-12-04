# Pull Request: Inserção e Remoção no Modo Apresentação

## Resumo

Implementação da funcionalidade de inserção e remoção de valores na árvore rubro-negra durante o modo apresentação, com navegação automática para o início da animação e reprodução automática.

## Funcionalidades Implementadas

### Inserção e Remoção no Modo Apresentação

- Adicionado campo de input para inserir valores (suporta múltiplos valores separados por vírgula ou espaço)
- Adicionado botão "Inserir" para adicionar valores à árvore
- Adicionado botão "Remover" para remover valores da árvore
- Interface posicionada no painel de controles inferior do modo apresentação

### Navegação Automática

- Ao inserir ou remover um elemento, o sistema navega automaticamente para o primeiro passo da nova operação
- Funciona independentemente do estado atual (pausado, reproduzindo, ou em qualquer passo anterior)
- Não interfere na lógica da árvore, apenas controla a visualização da animação

### Reprodução Automática

- Após inserir ou remover um elemento, a animação é reproduzida automaticamente desde o primeiro passo até o final da operação
- A reprodução é iniciada automaticamente após a navegação para o primeiro passo da nova operação
- Inclui verificação de segurança para garantir que há passos disponíveis antes de iniciar a reprodução

## Mudanças Técnicas

### Componente PresentationMode

- Adicionada prop `onRemove` na interface `PresentationModeProps`
- Implementado estado `inputValue` para gerenciar o campo de entrada
- Implementados handlers `handleInsert` e `handleRemove`
- Adicionado sistema de refs (`previousTotalStepsRef` e `shouldNavigateToNewOperationRef`) para rastrear mudanças nos passos
- Implementado `useEffect` duplo para detectar quando novos passos são adicionados (baseado em `totalSteps` e `steps.length`)

### Componente RedBlackTreeVisualizer

- Passada a função `remove` para o `PresentationMode` via prop `onRemove`
- Mantida a prop `onInsert` já existente

## Comportamento

1. Usuário insere ou remove um valor no modo apresentação
2. Sistema salva o número de passos atual antes da operação
3. Operação é executada (inserção/remoção na árvore)
4. Quando novos passos são detectados, o sistema navega para o primeiro passo da nova operação
5. A reprodução automática é iniciada após um pequeno delay (50ms) para garantir que a navegação ocorreu primeiro
6. A animação é reproduzida automaticamente até o final da operação

## Funcionalidades Adicionais

### Botão de Compartilhar

- Implementado botão "Compartilhar" no modo normal de visualização
- Gera URL com search params contendo os valores atuais da árvore (parâmetro `v`)
- Copia automaticamente a URL para a área de transferência
- Exibe notificações de sucesso ou erro usando o sistema de toast
- Validação para evitar compartilhamento de árvore vazia

### Integração com Search Params

- A aplicação lê automaticamente os search params da URL ao carregar
- Suporta parâmetros `v` ou `values` para carregar valores iniciais
- Função `extractSearchParams` processa múltiplos formatos:
  - Arrays JSON: `?v=[10,20,30]`
  - Valores separados por vírgula: `?v=10,20,30`
  - Valores separados por ponto e vírgula ou espaço: `?v=10;20;30`
  - Múltiplos parâmetros individuais: `?10&20&30`
- Valores são inseridos automaticamente na árvore ao detectar search params na URL
- Permite compartilhar estados específicos da árvore através de links

## Validações

- Verificação de que há passos disponíveis antes de iniciar a reprodução
- Tratamento de falhas na remoção (cancela navegação se o valor não for encontrado)
- Atualização correta das referências mesmo quando não é uma navegação programada
- Validação de árvore vazia antes de compartilhar
- Tratamento de erros ao copiar para área de transferência
