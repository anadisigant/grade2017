# Grade BSI 2016.2

Rastreador de progresso da grade curricular do curso de Bacharelado em Sistemas de Informação (Matriz 2016.2). Permite marcar disciplinas concluídas e acompanhar o desbloqueio de pré-requisitos.

// Sim, tem cara e jeito do primo pobre do react. Mas é só um Vanilla JS feito com uma certa preguiça
---

## Como rodar

```bash
npx serve .
```

Ou com a extensão **Live Server** do VS Code: clique com o botão direito no `index.html` → *Open with Live Server*.

---

## Estrutura dos arquivos

```
├── index.html     — Marcação da página
├── style.css      — Todos os estilos e variáveis de tema
├── BSI2016.js     — Dados da grade BSI 2016.2
├── state.js       — Estado da aplicação e persistência (localStorage)
├── tooltip.js     — Exibição e posicionamento do tooltip
├── ui.js          — Renderização e atualização do DOM
└── app.js         — Ponto de entrada: inicializa e conecta os módulos
```

### Fluxo resumido

1. `app.js` chama `loadTheme()`, `loadProgress()` e `render()` na inicialização
2. `render()` em `ui.js` constrói o grid uma única vez
3. Cliques nos cards chamam `toggle()` em `state.js`, que atualiza o `Set` de disciplinas concluídas
4. Depois do toggle, `patchAll()` percorre só os cards cujo estado mudou e atualiza classes e atributos diretamente no DOM sem recriar nada
5. `saveProgress()` persiste o estado em `localStorage`

### Como os estados funcionam

Cada disciplina pode estar em um de quatro estados, calculados em `getState()` dentro de `state.js`:

| Estado | Condição |
|--------|----------|
| `done` | ID está no `Set done` |
| `opt` | Tipo é `OPT` e não está concluída |
| `avail` | Todos os pré-requisitos estão em `done` |
| `lock` | Um ou mais pré-requisitos faltam |

Ao desmarcar uma disciplina, todas as que dependem dela (direto ou indiretamente) são desmarcadas em cascata.

---

## Contribuindo

Para abrir um PR, crie uma branch com nome descritivo (`feat/responsividade`, `feat/acessibilidade`) e descreva o que foi feito na descrição do PR.

Abaixo estão as contribuições que ainda precisam ser implementadas.

---

### Responsividade

Atualmente a grade usa scroll horizontal em telas pequenas. O ideal seria adaptar o layout para mobile de forma mais ergonômica.

O que implementar:

- Em telas estreitas (< 480px), empilhar os semestres verticalmente em vez de rolar na horizontal
- Considerar um layout em acordeão: cada semestre colapsável, mostrando só o cabeçalho por padrão
- Testar nos tamanhos: 375px (iPhone SE), 390px (iPhone 14), 412px (Android comum)
- O breakpoint já existente em `style.css` (linha com `@media (max-width: 600px)`)
  
---

### Acessibilidade — leitura por tela

Essa contribuição é prioritária. Uma colega do curso usa leitor de tela, e a interface atual não está preparada para isso.

O que implementar:

**Semântica e estrutura**
- Cada coluna de semestre deveria ser um `<section>` com `aria-labelledby` apontando para o cabeçalho
- Os cards são `<div>` com `click` — trocar por `<button>` ou adicionar `role="checkbox"`, `aria-checked` e `tabindex="0"`
- Adicionar `aria-label` descritivo nos cards: `"Algoritmos e Programação, 60 horas, concluída"` ou `"bloqueada, faltam: Estruturas de Dados"`

**Navegação por teclado**
- Cards precisam ser focáveis e ativáveis com `Enter` e `Space`
- A ordem de foco deve seguir a ordem visual (semestre 1 → 8, de cima pra baixo dentro de cada coluna)
- Adicionar estilo de foco visível (`:focus-visible`) que seja distinguível, especialmente no tema claro

**Feedback de ação**
- Ao marcar/desmarcar uma disciplina, anunciar a mudança para o leitor via `aria-live="polite"` — por exemplo: `"Algoritmos e Programação marcada como concluída. 3 disciplinas desbloqueadas."`
- O toast atual é visual; precisa de um equivalente acessível (região `aria-live` no HTML)

**Tooltip**
- O tooltip atual só aparece no hover, inacessível pelo teclado
- Ao focar um card, as informações do tooltip (pré-requisitos, o que desbloqueia) devem estar disponíveis via `aria-describedby` ou serem lidas diretamente

**Tema e contraste**
- Verificar se as cores de ambos os temas passam na relação de contraste mínima WCAG AA (4.5:1 para texto normal)
- O estado `s-lock` usa `opacity: 0.45`, o que pode tornar o texto ilegível — considerar uma abordagem que não dependa só de opacidade

**Onde mexer**
- `index.html` — estrutura semântica e atributos ARIA estáticos
- `ui.js` → função `buildCard` — atributos ARIA dinâmicos (`aria-checked`, `aria-label`, `aria-describedby`)
- `ui.js` → função `patchCard` — manter os atributos atualizados após cada toggle
- `style.css` — estilos de foco e contraste

---

### Outras melhorias abertas

- **Exportar progresso** — baixar um JSON com as disciplinas concluídas para backup ou compartilhar com colegas
- **Importar progresso** — carregar um JSON exportado anteriormente
- **Filtro por tipo** — mostrar só CCO, só TEC, etc.
- **Modo "planejamento"** — marcar disciplinas que pretende cursar no próximo semestre, com cor distinta

---

## Dados da grade

Os dados da grade BSI 2016.2 estão em `BSI2016.js` e podem ser atualizados caso a grade mude. Cada disciplina segue o formato:

```js
{ id: 'd01', sem: 1, nome: 'Algoritmos e Programação', tipo: 'CCO', h: 60, pre: [] }
```

Os tipos existentes são: `CCO`, `COM`, `MAT`, `HUM`, `TEC`, `SUP`, `OPT`.
