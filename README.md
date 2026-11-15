# Rick & Morty Explorer

Projeto acadêmico desenvolvido com HTML, CSS e JavaScript puro. A página consulta a Rick and Morty API e cria os cards de personagens dinamicamente.

## Como executar
1. Extraia a pasta do projeto.
2. Abra `index.html` no navegador. Se preferir, use a extensão Live Server do VS Code.
3. A página precisa de conexão com a internet para consultar a API e carregar as imagens.

## Funcionalidades
- Consumo da API com `fetch()`.
- Cards criados com `document.createElement()` e inseridos com `appendChild()`.
- Pesquisa por nome.
- Filtro por status.
- Favoritos salvos no `localStorage`.
- Paginação entre páginas da API.
- Layout responsivo para celular e computador.

## API utilizada
Rick and Morty API: https://rickandmortyapi.com/
Endpoint: `https://rickandmortyapi.com/api/character`

A API pública não exige token para os endpoints REST utilizados neste projeto. A resposta de personagens contém `info` (paginação) e `results` (lista de personagens). Cada personagem possui, entre outros campos, `name`, `status`, `species`, `gender`, `origin`, `location` e `image`.

## Estrutura
- `index.html`: estrutura da página.
- `css/style.css`: aparência e responsividade.
- `js/script.js`: requisição, filtros e criação dinâmica dos cards.
- `relatorio_teorico.pdf`: parte teórica da atividade.
- `roteiro_video_pitch.txt`: sugestão de roteiro para o vídeo.

## Publicação no GitHub
Crie um repositório público no GitHub e envie os arquivos desta pasta. Depois, copie o link do repositório para a entrega. Para publicar o site, pode ativar GitHub Pages em Settings > Pages e selecionar a branch principal e a pasta raiz.

## Observação
Os dados são carregados sob demanda quando a página é aberta e quando o usuário troca de página. Portanto, o conteúdo depende da disponibilidade da API e da conexão com a internet.
