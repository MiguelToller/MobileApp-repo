# 🚀 App Tarefas

Aplicativo mobile focado no gerenciamento de tarefas, projetado com uma interface de usuário moderna e animações fluidas. Foi desenvolvido utilizando **React Native** e **Expo**, com foco em usabilidade, escalabilidade e segurança na tipagem com TypeScript.

## ✨ Funcionalidades

- **CRUD Completo**: Crie, visualize, edite e exclua tarefas.
- **Visual Premium**: Design moderno em *Dark Mode*, com tipografia refinada e sombras que conferem profundidade à interface.
- **Animações Fluidas**: Feedbacks visuais automáticos graças à integração com `react-native-reanimated`. As tarefas deslizam e esmaecem naturalmente.
- **Formulário Dinâmico em Modal**: O cadastro e edição não ocupam a tela principal desnecessariamente; são invocados de maneira elegante usando um "Floating Action Button" (FAB).
- **Validações Práticas**: Máscara automática (DD/MM/AAAA) e validação em tempo real para campos obrigatórios de datas e textos.
- **Empty State Customizado**: Visual engajador para quando o usuário zera sua lista de afazeres.

---

## 🛠️ Tecnologias Utilizadas

- **[React Native](https://reactnative.dev/)**: Framework principal de desenvolvimento mobile.
- **[Expo](https://expo.dev/)**: Ferramentas e serviços em torno do React Native.
- **[TypeScript](https://www.typescriptlang.org/)**: Supersét do JavaScript adicionando tipagem estática.
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)**: Biblioteca poderosa para a criação de animações em 60fps.

---

## ⚙️ Pré-requisitos

Para rodar este projeto, você precisará ter instalado em sua máquina:
- **Node.js** (versão 18 ou superior recomendada)
- **Git**
- Seu celular (com o aplicativo *Expo Go* instalado) ou um emulador (Android Studio / Xcode).

---

## 📥 Como Instalar

1. Abra o terminal e navegue até a pasta deste projeto (`app_tarefas`).
2. Instale as dependências executando o comando abaixo:

```bash
npm install
```

> **Dica:** Se preferir, você também pode usar o `yarn` executando `yarn install`.

---

## ▶️ Como Rodar o Projeto

Após a instalação das dependências, você tem diferentes opções para testar o aplicativo:

### Opção 1: Rodar no dispositivo físico (Recomendado)
Inicie o servidor do Expo:
```bash
npm start
# ou
npx expo start
```
Após executar este comando, um *QR Code* aparecerá no terminal. 
- **Se você usa Android:** Abra o aplicativo **Expo Go** e escaneie o código.
- **Se você usa iOS (iPhone):** Abra o aplicativo da **Câmera**, aponte para o QR Code e clique no link que aparecer para abrir no Expo Go.

### Opção 2: Rodar no Navegador (Versão Web)
Se você apenas quiser testar rapidamente pelo seu computador sem um celular ou emulador:
```bash
npm run web
```
Isso abrirá uma nova aba no seu navegador padrão carregando o aplicativo.

### Opção 3: Rodar no Emulador
Com o Android Studio ou o Xcode abertos e configurados, execute:
```bash
# Para Emulador Android
npm run android

# Para Emulador iOS (Disponível apenas em computadores macOS)
npm run ios
```

---

## 📂 Estrutura do Projeto

```text
app_tarefas/
 ┣ src/
 ┃ ┣ app/
 ┃ ┃ ┗ index.tsx         // Tela Principal do Aplicativo
 ┃ ┣ components/
 ┃ ┃ ┣ TaskCard.tsx      // Componente visual do Cartão de Tarefa
 ┃ ┃ ┗ TaskForm.tsx      // Componente do Formulário no Modal
 ┃ ┗ types/
 ┃ ┃ ┗ index.ts          // Tipos do TypeScript (ex: interface Task)
 ┣ app.json              // Configurações do Expo
 ┣ package.json          // Dependências do Projeto
 ┗ README.md             // Esta documentação
```

---
