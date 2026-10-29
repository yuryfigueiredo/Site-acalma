# Acalmo

Experiências de pausa, respiração guiada, paisagens sonoras, escrita local e leituras em https://acalmo.com.br.

## Desenvolvimento

As fontes ficam em `src/`. Execute `npm run build` para gerar `dist/`, `npm run check` para verificar as páginas e `npm test` para testar as ferramentas.

## Publicação

O projeto Vercel `yury11/site-acalmo` usa a branch `main` deste repositório. O arquivo `vercel.json` configura a construção e publica somente `dist/`.

O site funciona sem conta. O diário e os favoritos ficam no navegador. Os links da Amazon usam o identificador público de afiliado informado pelo proprietário. AdSense e análise de visitantes não estão ativados nesta versão.

## Conteúdo editorial

O fluxo de rascunho e revisão está documentado em `docs/editorial.md`. A geração via API roda separadamente da construção do site e não publica automaticamente. Chaves ficam em `.env.local`, fora do Git e da hospedagem. Somente artigos aprovados em `content/posts/` entram na construção.
