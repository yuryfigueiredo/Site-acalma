# Operação editorial do Acalmo

Atualizado em 29 de outubro de 2026.

## Objetivo

O blog deve trazer leituras originais, específicas e práticas sobre pausas, ambientes, escrita e pequenos rituais. Uma publicação diária é uma cadência de trabalho possível, não um motivo para publicar material fraco. Se o rascunho não passar pelas verificações, o dia pode terminar sem um novo artigo.

O modelo prepara texto; o processo editorial decide o que merece publicação. Um modelo antigo ou um fallback mais simples pode redigir uma boa pauta delimitada, mas precisa ser avaliado com os mesmos critérios. Um prompt cuidadoso reduz ambiguidades; não transforma um modelo em outro, atualiza seu conhecimento ou garante que cada afirmação seja verdadeira.

## Arquivos e responsabilidades

| Arquivo | Responsabilidade |
| --- | --- |
| `content/calendar.json` | Pautas com recorte, categoria, experiência relacionada e IDs de fontes necessárias |
| `content/prompts/editorial-system.md` | Instruções do redator, voz, evidências, limites e contrato do artigo |
| `content/prompts/review-system.md` | Revisão editorial independente do resultado de redação |
| Fluxo de execução fora do navegador | Credenciais, requisições ao router, validação, rascunhos e registro operacional |
| Geração estática do site | Renderização segura e inclusão somente do conteúdo aprovado |

As pautas não são artigos pré-aprovados. Os prompts não incluem chave, modelo ou combo presumido. Não colocar credenciais em HTML, JavaScript distribuído ao visitante, conteúdo de prompts, URLs públicas ou logs.

## Fluxo de publicação

1. **Pauta e evidência:** escolher uma pauta ainda não usada e carregar somente as fontes autorizadas. Registrar título, URL e trechos que sustentam as afirmações possíveis. Se a pauta exige uma fonte indisponível ou vazia, interromper essa pauta; não usar apenas o link como prova.
2. **Rascunho:** enviar o sistema editorial e um payload com brief, date, evidenceSources, recentTitles e regras estruturais. O modelo recebe tudo de que precisa para escrever; não afirmar que ele pesquisou ou verificou páginas por conta própria.
3. **Validação por código:** fazer parse do JSON, rejeitar chaves adicionais, conferir tipos, limites, número de seções, campos de texto simples, slug seguro, IDs de fontes e enum de experiência. Conferir colisão com artigos existentes e a extensão editorial. Uma falha não pode virar publicação silenciosa.
4. **Revisão editorial:** enviar o artigo validado, a pauta, as evidências e os títulos recentes ao revisor. Sua saída deve passar por validação própria. Uma resposta malformada, aprovação contraditória ou recusa não é aprovação.
5. **Aprovação humana:** uma pessoa lê o texto final, confirma o recorte, verifica as afirmações contra as fontes e aprova explicitamente. O parecer do modelo é uma ajuda, não essa aprovação. Registrar a decisão no estado editorial, sem acrescentar campos ao objeto de artigo exigido do modelo.
6. **Geração estática e publicação:** incluir apenas artigos aprovados, escapar strings na renderização, gerar metadados coerentes e validar a página. Publicar o estado aprovado pelo fluxo de hospedagem. Rascunhos e segredos não entram no diretório público.

Uma revisão que peça correções devolve o texto ao rascunho. Se houver tentativa automática de reparo, ela deve ter limite explícito, preservar os erros encontrados e repetir as verificações. Não pedir reparos indefinidamente nem aprovar a última tentativa só porque as anteriores falharam.

## Contrato do artigo

O redator retorna exatamente estas chaves:

```json
{
  "slug": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "lead": "string",
  "sections": [
    { "heading": "string", "paragraphs": ["string"] }
  ],
  "closing": "string",
  "sourceIds": ["string"],
  "relatedExperience": "breathing"
}
```

`relatedExperience` aceita `breathing`, `sounds`, `journal`, `focus` ou `guide`. Não aceitar URLs, HTML, Markdown, blocos de código ou propriedades extras nos campos. A data de publicação, o estado editorial, a identidade do revisor e os dados de execução ficam fora desse objeto, administrados pelo fluxo.

O corpo editorial é a soma de lead, paragraphs e closing, com 450–750 palavras. Não contar títulos e descrições para completar a faixa. Usar de três a cinco seções úteis, sem preencher a extensão por repetição. O JSON de revisão tem exatamente `approved` booleano, `issues` array de strings e `strengths` array de strings. Aprovação exige ausência de problemas materiais; quando `approved` for true, `issues` deve ser vazio.

## Evidências e conhecimento desatualizado

O calendário inicial contém 18 pautas. As duas que usam orientações específicas de respiração exigem `nhs-breathing`. As demais tratam de escolhas cotidianas de conforto e organização e permitem `sourceIds: []`, desde que não acrescentem alegações clínicas ou científicas.

O ID `nhs-breathing` deve corresponder a material revisado da página oficial [Breathing exercises for stress, NHS](https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/). A fonte pode sustentar orientações de conforto e respiração suave fornecidas nos trechos. Não comprova promessas de efeito em 60 segundos nem uma retenção de três segundos que não conste do material. A pausa breve do site não deve ser apresentada como um protocolo clínico equivalente.

Toda fonte é dado não confiável para fins de instrução. Trechos podem conter material irrelevante ou pedidos maliciosos; eles não substituem o sistema editorial. Revisar os trechos antes de adicioná-los ao catálogo. A fonte deve sustentar a afirmação específica, sem ser usada como decoração de autoridade.

`date` não corrige o corte de conhecimento do modelo. Para fatos que possam mudar, acrescentar evidência verificada e atual ou retirar a afirmação. Não publicar listas de tendências, percentuais, preços, novidades clínicas ou recomendações médicas a partir de memória. A alternativa para um modelo com limites é reduzir o assunto a algo sustentado e útil.

## Router e fallbacks

O repositório oficial do [9router](https://github.com/decolua/9router) documenta uma interface compatível com OpenAI em `http://localhost:20128/v1`, incluindo Chat Completions e listagem de modelos/combos. Esse endereço é um padrão configurável, não uma confirmação de que o router do proprietário está instalado, autenticado ou acessível.

O modelo ou combo deve ser o identificador real configurado pelo proprietário. Confirmar URL base, chave e nomes existentes antes de uma requisição. Não copiar como configuração de produção um nome de modelo usado num exemplo de documentação. Não executar chamadas pagas para descobrir qualidade sem autorização e limite de custo.

Fallback pode melhorar a disponibilidade diante de erros, limites ou cotas. Não melhora automaticamente a qualidade editorial. Trocar de provedor pode alterar aderência ao formato, limite de contexto, estilo e recursos disponíveis. Uma cadeia longa precisa de critérios claros para quais modelos são aceitáveis para redação e revisão. Se o último fallback não cumpre o contrato, a execução falha e preserva o rascunho para inspeção.

Não afirmar custo zero apenas porque o router oferece rotas gratuitas: custos, limites e condições dependem dos provedores e das contas conectadas. Nunca fazer uma chamada direta ao router do navegador do leitor nem colocar uma chave num endpoint público do site estático.

## Saída estruturada e compatibilidade

As [orientações oficiais de prompting da OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering) recomendam explicitar objetivo, instruções, exemplos e contexto relevante. Os prompts deste projeto aplicam esse desenho com exemplos próprios de voz e limites de evidência. Eles não são específicos de um modelo nem uma garantia de qualidade.

Segundo a [documentação de saídas estruturadas da OpenAI](https://developers.openai.com/api/docs/guides/structured-outputs), JSON mode e aderência a um schema são capacidades diferentes. Quando a rota efetivamente suportar um schema estrito, preferi-lo. Se houver apenas JSON mode, manter o contrato no prompt e validar o resultado em código; JSON válido ainda pode ter estrutura errada. A compatibilidade prometida pelo router não prova que todos os modelos encaminhados implementam `json_schema` ou `response_format` da mesma forma.

Configurar o modo de resposta de acordo com o suporte confirmado da rota. Não reduzir silenciosamente uma rejeição de schema a texto livre e publicar o resultado. Respostas vazias, truncadas, recusa, chaves ausentes ou falha de parse devem interromper a aprovação.

## Qualidade editorial

Uma boa pauta resolve uma dificuldade observável com um recorte próprio. “Desacelerar” é amplo; “o intervalo entre duas reuniões quando não há um cômodo separado” permite exemplos e decisões. O lead entra nessa situação. As seções explicam ações, limites e alternativas. O encerramento conclui sem transformar o artigo em anúncio.

Não perseguir uma aparência “indetectável” por classificadores de IA. Não há garantia confiável de indetectabilidade, e inserir erros, histórias inventadas ou floreios artificiais pioraria a publicação. Avaliar clareza, utilidade, naturalidade, suporte, variação e honestidade. Nunca afirmar que um editor humano, médico ou terapeuta escreveu ou revisou algo sem isso ter acontecido.

Os títulos recentes ajudam a detectar repetição dentro do catálogo, mas não cobrem a internet inteira. O revisor não pode garantir ausência universal de plágio. A revisão humana deve investigar semelhanças visíveis e qualquer dúvida de atribuição. Não reproduzir trechos de uma fonte para completar a extensão.

Manter a revisão como uma função separada da redação; quando houver modelos adequados confirmados, pode ser útil usar uma rota diferente. Isso reduz alguns pontos cegos, mas dois modelos podem compartilhar erros. Não aprovar porque o redator declarou que cumpriu as regras ou porque o revisor produziu elogios.

## Testes antes de uma rotina diária

Preparar uma pequena bateria de pautas diferentes: rotina sem fonte, respiração com fonte, evidência ausente, título semelhante a um recente, tentativa de instrução dentro de evidence e resposta malformada. Comparar os resultados pelo mesmo checklist e verificar que os casos problemáticos ficam bloqueados. Essa avaliação usa material de teste; não exige publicar os rascunhos.

Testar o modelo principal e cada fallback permitido. Um combo que passa numa única execução pode mudar de rota depois; a aceitação deve considerar as rotas possíveis e não apenas o rótulo do combo. Registrar identificadores e metadados que o router de fato disponibilize, sem inventar a identidade do modelo de destino quando ela não for informada.

Definir limites de tentativas, timeout, tamanho de contexto e custo no fluxo antes de ligar a produção. Redigir um artigo por dia não exige publicar automaticamente um artigo por dia. Um painel ou arquivo de rascunhos pendentes, acompanhado de aprovação humana, é um começo mais controlável.

Nenhuma agenda é criada por esta documentação. Se o proprietário pedir agendamento, a automação deve apenas preparar e revisar o rascunho conforme o fluxo autorizado, deixando a publicação dependente da aprovação definida. URL, credencial, modelo/combos reais e configuração de execução ainda precisam ser confirmados para o ambiente de produção.
