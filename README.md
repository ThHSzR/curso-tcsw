# 📚 Plataforma de Cursos Online — LAB03

Aplicação frontend desenvolvida como parte do **LAB03**, com o objetivo de gerenciar o ciclo de vida acadêmico e financeiro de uma plataforma de cursos online.

---

## ✅ Critérios de Avaliação

| Critério | Status | Detalhes |
|---------|--------|----------|
| **Design e Usabilidade (Bootstrap)** | ✅ Atendido | Classes Bootstrap 5 em todos os formulários, tabelas, modais, cards e navegação |
| **Estrutura do Projeto** | ✅ Atendido | Pastas `components/`, `models/`, `services/` e `pages/` devidamente organizadas |
| **Roteamento** | ✅ Atendido | React Router configurado no `App.tsx` com rota dedicada para cada página |
| **Consumo da API (JSON Server)** | ✅ Atendido | Todos os services consomem o JSON Server via `fetch` com GET, POST, PUT e DELETE |

### Cobertura de Entidades

Todas as **13 entidades** do modelo de dados do enunciado estão implementadas:

| Módulo | Entidades |
|--------|-----------|
| **Core** | Usuários, Instrutores, Categorias, Níveis |
| **Conteúdo** | Cursos, Módulos, Aulas |
| **Interação** | Matrículas, Avaliações, Progresso de Aulas |
| **Curadoria** | Trilhas, Trilhas\_Cursos, Certificados |
| **Negócio** | Planos, Assinaturas, Pagamentos |

---

## 🛠️ Stack

| Tecnologia | Versão | Papel |
|---|---|---|
| React | 18 | Framework UI |
| TypeScript | 5 | Tipagem estática |
| Vite | 5 | Build tool |
| Bootstrap 5 | 5.x | Estilização e componentes |
| JSON Server | — | API REST simulada (`http://localhost:3001`) |

---

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── App.tsx                   # Roteamento principal
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Estilos globais
│   ├── components/
│   │   ├── Header/               # Navbar + offcanvas
│   │   ├── Modal/                # Modal reutilizável
│   │   ├── Toast/                # Notificação temporária
│   │   └── SearchBox/            # Campo de busca com autocomplete
│   ├── models/                   # Interfaces de modelos auxiliares
│   ├── services/                 # Interfaces TypeScript + CRUD HTTP
│   └── pages/                    # Telas CRUD da aplicação
└── package.json
```

---

## 🚀 Como Rodar

### 1. Instalar dependências

```bash
cd frontend
npm install
```

### 2. Iniciar o servidor de dados (JSON Server)

```bash
# Na raiz do projeto
npx json-server --watch db.json --port 3001
```

### 3. Iniciar o frontend

```bash
cd frontend
npm run dev
```

Acesse em: **http://localhost:5173**

### 4. Build de produção

```bash
cd frontend
npm run build   # ⚠️ sempre "npm run build", nunca "npm build"
```

---

## 📄 Módulos e Páginas

| Módulo | Páginas |
|--------|---------|
| **Core** | Usuários, Instrutores, Categorias, Níveis |
| **Conteúdo** | Cursos, Módulos, Aulas |
| **Interação** | Matrículas, Avaliações |
| **Curadoria** | Trilhas, Certificados |
| **Negócio** | Planos, Assinaturas, Pagamentos |
| **Relatório** | SGCursos (Gestão de Cursos), Home (Dashboard) |

---

## 🗄️ Modelo de Dados

### Entidades principais e campos implementados

| Entidade | Campos |
|----------|--------|
| `Usuario` | `id`, `nome`, `email`, `senha`, `perfil` |
| `Instrutor` | `id`, `nome`, `email`, `especialidade` |
| `Categoria` | `id`, `nome` |
| `Nivel` | `id`, `nome` |
| `Curso` | `id`, `titulo`, `descricao`, `nivel`, `totalAulas`, `totalHoras`, `instrutorId`, `categoriaId`, `dataPublicacao` |
| `Modulo` | `id`, `titulo`, `ordem`, `cursoId` |
| `Aula` | `id`, `titulo`, `tipoConteudo`, `urlConteudo`, `duracaoMinutos`, `ordem`, `moduloId` |
| `Matricula` | `id`, `usuarioId`, `cursoId`, `dataMatricula`, `status` |
| `Avaliacao` | `id`, `usuarioId`, `cursoId`, `nota`, `comentario`, `data` |
| `Trilha` | `id`, `titulo`, `descricao`, `categoriaId` |
| `TrilhaCurso` | `id`, `trilhaId`, `cursoId`, `ordem` |
| `Certificado` | `id`, `usuarioId`, `cursoId`, `dataEmissao`, `codigo` |
| `Plano` | `id`, `nome`, `descricao`, `preco`, `duracaoMeses` |
| `Assinatura` | `id`, `usuarioId`, `planoId`, `dataInicio`, `dataFim` |
| `Pagamento` | `id`, `assinaturaId`, `valor`, `data`, `metodo`, `status` |
| `ProgressoAula` | `id`, `usuarioId`, `aulaId`, `concluida`, `dataAcesso` |

> ⚠️ **Atenção:** `tipoConteudo` usa PascalCase obrigatório: `'Video' | 'Texto' | 'Quiz'`

---

## ⚠️ Armadilhas Comuns (TypeScript)

| Erro | Correção |
|------|----------|
| `Property 'nome' does not exist on type 'Aula/Modulo/Trilha/Curso'` | Usar `titulo` |
| `Property 'cargaHoraria' does not exist` | Usar `totalHoras` |
| `Property 'nivelId' does not exist` | Usar `nivel` (string direta) |
| `Property 'descricao' does not exist on type 'Modulo'` | Campo não existe — remover |
| `Type '"video"' is not assignable to type '"Video"'` | Usar `'Video'` (PascalCase) |
| `Property 'status' is missing in type 'Assinatura'` | `Assinatura` não tem `status` |
| `tabindex` not assignable | Usar `tabIndex` (camelCase no JSX) |
| `IAula` / `IUsuario` has no exported member | Usar `Aula`, `Usuario` (sem prefixo `I`) |

---

## 🧩 Componentes Reutilizáveis

### `<Modal />`

```tsx
<Modal
  title="Novo Curso"
  onClose={() => setModal(null)}
  onConfirm={save}
  confirmLabel="Salvar"        // opcional
  confirmClass="btn btn-primary" // opcional
>
  {/* formulário aqui */}
</Modal>
```

### `<Toast />`

```tsx
<Toast
  message="Curso criado com sucesso!"
  type="success"   // 'success' | 'error'
  onClose={() => setToast(null)}
/>
```

### `<SearchBox />`

```tsx
<SearchBox
  label="Usuário"
  options={usuarios.map(u => ({ id: u.id, label: u.nome }))}
  value={form.usuarioId}
  onChange={(id) => setForm({ ...form, usuarioId: id })}
/>
```

---

## 👥 Grupo

Projeto desenvolvido para a disciplina de **Tecnologias e Construção de Software para Web**.
