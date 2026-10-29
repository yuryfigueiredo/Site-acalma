# Acalmo: estratégia de produto, aquisição e receita

Documento de decisão do projeto. Atualizado em 29 de outubro de 2026.

**Atualização da implementação:** o proprietário forneceu o StoreID Amazon `abcinvestimen-20`. A primeira versão já inclui três buscas por categorias (máscaras de descanso, cadernos e luminárias), com declaração de afiliado e critérios de escolha. Não há preços ou testes de produtos inventados. O identificador foi colocado nos links; aprovação da conta, cadastro do endereço e atribuição de comissões precisam ser conferidos no painel do proprietário. O CodeGraph foi inicializado na pasta principal e indexa a fonte em `acalmo/src/`. A água reativa é o destaque da primeira tela, conforme solicitado.

## Recomendação

O Acalmo deve começar como um lugar para fazer uma pequena pausa, com acesso imediato e sem cadastro. A respiração guiada é a experiência principal. Sons, escrita e foco atendem situações próximas e dão motivos diferentes para voltar. A frase compartilhável ajuda a apresentar a marca a outras pessoas. O produto digital próprio é a primeira aposta comercial; afiliados e publicidade entram de forma seletiva depois.

O diferencial precisa aparecer no uso: escolher rapidamente, começar sem obstáculos e terminar com autonomia. Uma paisagem interativa chama atenção, mas precisa acompanhar uma experiência que a pessoa queira repetir. Ter mais funções não garante esse resultado.

As decisões deste documento são hipóteses de produto a validar, não uma previsão de tráfego, receita ou efeito sobre a saúde. O escopo descreve a versão em construção; a confirmação de cada comportamento depende da verificação da entrega.

## Ponto de partida e propósito

A pasta local estava vazia. A conversa anterior produziu uma demonstração de respiração, não um site completo já operando. O domínio informado pelo proprietário é acalmo.com.br. O novo projeto Sites começa privado; o registro do domínio não equivale à sua conexão à hospedagem. A publicação para visitantes e a configuração de domínio continuam sendo decisões separadas.

**Propósito:** oferecer pequenos rituais digitais que ajudem a pessoa a criar espaço no dia, com uma experiência tranquila e fácil de acessar.

**Posicionamento:** Acalmo — um lugar para desacelerar.

**Público inicial proposto:** adultos de língua portuguesa que passam parte do dia diante de telas e procuram uma transição entre tarefas, uma pausa do trabalho ou um ritual noturno simples. A escolha é situacional; não supõe diagnóstico, profissão, renda ou condição clínica.

**Tarefas principais:**

- Entre duas atividades, quero parar por um minuto sem instalar nada.
- Ao terminar o trabalho, quero criar uma transição para o restante do dia.
- Quero ouvir um ambiente discreto enquanto leio ou me concentro.
- Antes de dormir, quero reduzir a quantidade de decisões e estímulos.
- Quero colocar pensamentos em palavras sem precisar criar uma conta.

O site não fará diagnóstico, triagem clínica, tratamento ou acompanhamento de crises. Não prometerá curar ansiedade, eliminar insônia ou produzir um estado emocional em tempo determinado.

## Arquitetura da experiência

A entrada deve perguntar **“O que você precisa agora?”**. Esse texto direciona uma ação sem exigir que a pessoa classifique ou registre seu estado emocional.

| Intenção | Primeiro destino | Opção seguinte |
| --- | --- | --- |
| Desacelerar | Respiração guiada curta | Repetir ou ouvir um ambiente |
| Preparar a noite | Tema noturno e um ritual simples | Som com temporizador ou leitura do guia |
| Recuperar o foco | Temporizador com duração explícita | Som opcional e pausa curta |
| Esvaziar a cabeça | Escrita com três perguntas | Encerrar, apagar ou salvar localmente |
| Só ficar em silêncio | Pausa visual sem áudio | Permanecer ou encerrar |

O tempo funciona como atalho, não como uma segunda barreira obrigatória: “Tenho 60 segundos” inicia uma proposta breve; 3, 5 e 10 minutos podem ampliar a mesma atividade. Não abrir um catálogo enorme após a escolha.

A navegação secundária reúne sons, meu espaço, leituras e o guia. A página principal apresenta uma experiência clara antes de expor as demais. Não mostrar todas as funções como cartões idênticos concorrendo por atenção.

## Prioridade e esforço

As classificações abaixo são avaliações internas para este projeto. Não são resultados de pesquisa com usuários.

| Recurso | Impacto esperado | Esforço relativo | Decisão |
| --- | --- | --- | --- |
| Respiração com início imediato e encerramento livre | Alto: entrega a proposta principal | Médio | Prioridade máxima |
| Entrada por intenção e atalho de tempo | Alto: reduz indecisão | Baixo a médio | Primeira versão |
| Mistura de sons com volumes e temporizador | Alto: atende uso recorrente | Médio | Primeira versão |
| Tema noturno e redução de movimento | Alto: conforto e acesso | Baixo a médio | Primeira versão |
| Escrita privada com salvamento opcional | Médio a alto: utilidade próxima ao propósito | Médio | Primeira versão, acesso secundário |
| Favoritos no navegador | Médio: facilita repetir uma escolha | Baixo a médio | Primeira versão |
| Frase original com imagem compartilhável | Médio: divulgação orgânica possível | Baixo a médio | Primeira versão, sem ocupar o foco da home |
| Foco 25/5 ou 50/10 | Médio: atende outra situação de uso | Médio | Complemento discreto; avaliar procura |
| Guia gratuito com sete pequenos rituais | Alto: demonstra qualidade editorial | Médio | Primeira versão |
| PWA com funções essenciais offline | Médio: acesso rápido e continuidade | Médio | Base inicial; testar instalação e cache |
| Áudios narrados pagos e checkout | Potencial alto de receita | Alto: produção, revisão, entrega e suporte | Após definir oferta e links reais |
| Login e sincronização entre aparelhos | Incerto no começo | Alto | Adiar até haver demanda observada |
| Comunidade, chat e recomendações por IA | Incerto e com complexidade adicional | Alto | Fora da primeira etapa |
| Assinatura mensal | Depende de valor recorrente comprovado | Alto | Adiar |
| Sequências obrigatórias e notificações insistentes | Incompatível com a marca | — | Não implementar |

## Requisitos das experiências

### Respiração

Começar com respiração suave e regular, sem retenção obrigatória. A orientação do NHS destaca conforto, ausência de esforço e contagem gentil, com possibilidade de a pessoa não alcançar cinco no início. O NHS propõe uma prática de pelo menos cinco minutos; a pausa de 3 ou 5 ciclos do Acalmo é uma versão introdutória de produto, não uma equivalência clínica dessa orientação. [Fonte: NHS](https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/).

Os controles devem permitir pausar, continuar e encerrar. Contagem, fase e movimento precisam concordar. A retenção de três segundos permanece opcional e desmarcada inicialmente. O texto convida a respirar no próprio ritmo e encerrar se houver desconforto. O áudio não é iniciado automaticamente.

Quando o usuário escolhe ciclos, informar a duração calculada. Quando escolhe minutos, não apresentar uma duração incompatível com a sequência escolhida: terminar um ciclo com clareza ou explicar eventual aproximação. Não cortar uma expiração apenas para fazer o relógio coincidir com um rótulo.

### Sons

Quatro atmosferas sintetizadas são suficientes para validar a utilidade. Permitir ligar mais de uma, ajustar cada volume, pausar todas e definir o desligamento. Informar que são atmosferas criadas digitalmente; não apresentá-las como gravações de chuva ou de uma floresta real.

A mistura não deve aumentar o volume de modo abrupto. Início e parada suaves, nenhum som sem gesto do usuário e mensagens úteis se o navegador não permitir reprodução. Nenhuma promessa de áudio terapêutico ou de frequências com benefícios médicos.

### Escrita

Três perguntas propostas: “O que está ocupando minha cabeça?”, “O que pode esperar?” e “Qual é um próximo passo pequeno?”. O conteúdo digitado deve permanecer no dispositivo nesta versão. Salvar é uma escolha explícita, não o comportamento escondido do formulário.

Oferecer limpar o registro e explicar o resultado do salvamento. O texto de confirmação não deve afirmar que algo foi salvo se o navegador bloquear ou falhar ao armazenar.

### Frase do dia

Usar reflexões originais e curtas, sem atribuir frases inventadas a autores reais. A imagem leva a marca e o endereço do site com discrição. O compartilhamento acontece somente após ação da pessoa. Oferecer download quando o compartilhamento nativo não estiver disponível. Cancelar a janela de compartilhamento não é um erro do usuário.

### Foco, favoritos e instalação

O temporizador informa a duração do bloco e da pausa; a pessoa pode interromper sem perder “pontos”. Sons continuam opcionais. Favoritos guardam escolhas funcionais, sem inventar um perfil psicológico.

A instalação PWA depende do navegador e da plataforma. Exibir o convite de instalação somente quando houver suporte, com orientação alternativa quando necessário. Não prometer que um temporizador ou áudio continuará funcionando de forma idêntica com tela bloqueada ou aplicativo em segundo plano. O sistema pode suspender a página. [Fonte: documentação de instalação de PWAs, MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing).

## Identidade e qualidade

Preservar a direção aprovada: areia, marfim e verdes discretos, tipografia editorial legível e movimento lento. O cenário deve responder ao mouse e ao toque, respeitando a preferência de movimento reduzido. A página precisa continuar útil sem a animação.

Luxo discreto deve significar precisão: botões fáceis de encontrar, poucas escolhas, contraste adequado e conteúdo bem editado. Não transformar baixa luminosidade em textos ilegíveis. Evitar som de entrada, pop-up de cadastro, contadores promocionais e depoimentos fictícios.

A navegação por teclado, o foco visível e os rótulos são parte da qualidade. Mudanças de fase podem ser anunciadas; cada segundo da contagem não deve disparar uma leitura em voz alta. A versão de celular deve manter a animação e os controles próximos durante a sessão.

## Retorno sem pressão

O retorno esperado vem de uma escolha que continua útil: mistura favorita, acesso direto à respiração, um guia que pode ser retomado ou uma frase que vale compartilhar. “Meu espaço” deve economizar trabalho, não medir disciplina.

Após uma sessão, oferecer no máximo duas ações relevantes. Exemplos: “Fazer outra pausa” e “Guardar esta escolha”. O encerramento deve ser satisfatório mesmo quando a pessoa sai imediatamente. Uma saída rápida após concluir uma pausa não é, por si só, uma falha.

Não usar perdas de sequência, avisos de culpa, notificações habilitadas por padrão nem mensagens de urgência comercial. E-mail só entra quando houver serviço de entrega, finalidade clara, mecanismo de saída e uma oferta que a pessoa realmente queira receber.

## Receita em três fases

### Fase 1: provar o uso e a qualidade

A experiência principal permanece gratuita. O guia de sete rituais demonstra a linguagem e o cuidado do Acalmo. O projeto recebe configurações para ofertas futuras, mas links vazios não devem criar botões de compra, formulários que fingem captar interessados ou publicidade fictícia.

O primeiro objetivo é observar pessoas usando o site e descobrir qual situação merece um produto mais desenvolvido. Não comprar tráfego em escala antes de entender essa utilização.

### Fase 2: produto próprio e afiliados selecionados

Hipótese inicial: **“7 noites para desacelerar”**, com sete áudios curtos, guia de apoio e roteiros simples. **R$39 é um preço de teste**, não uma avaliação de mercado nem promessa de conversão. O valor percebido deve vir da execução: áudio agradável, uso sem complicação, materiais claros e entrega confiável.

Antes de vender: concluir os arquivos, validar os direitos de uso de vozes e sons, definir responsável pela oferta, checkout, entrega, atendimento e condições aplicáveis. Não anunciar um pacote de áudios como disponível enquanto ele ainda não existe.

Condições de avanço propostas: conversar com usuários que completaram a experiência, identificar uma necessidade repetida e testar uma amostra com pessoas do público. Intenção declarada de compra é um sinal, não uma venda. Se houver oferta real, avaliar compras, conclusão do material, dúvidas e pedidos de reembolso.

Afiliados entram em poucos conteúdos nos quais uma escolha material faz sentido. Comparar utilidade, limitações, conforto e custo de manutenção. Explicar quando houver comissão e usar identificação técnica adequada nos links patrocinados. Não repetir descrições da loja ou afirmar que um produto foi testado sem ter sido. O Google identifica afiliação sem valor adicional como conteúdo de baixa qualidade; a análise própria é o trabalho editorial central. [Fonte: políticas de spam da Pesquisa Google](https://developers.google.com/search/docs/essentials/spam-policies?hl=pt-br#thin-affiliation).

### Fase 3: publicidade editorial controlada

AdSense é complemento, não premissa econômica do lançamento. A presença de uma ferramenta web não é, por si só, uma proibição geral de anúncios. As regras oficiais restringem telas sem conteúdo do editor, com baixo valor, em construção ou destinadas apenas a navegação e outros fins comportamentais. [Fonte: políticas de valor de inventário do Google](https://support.google.com/publisherpolicies/answer/11112688?hl=pt-BR).

Para o Acalmo, a decisão é manter anúncios fora das sessões, do diário, do mixer e dos temporizadores. Essa é uma escolha de experiência e de implementação cautelosa, não uma alegação de que toda ferramenta é proibida. O Google alerta que anúncios perto de controles e reprodução podem provocar cliques acidentais; publicidade deve ser distinguível. [Fonte: políticas de posicionamento do AdSense](https://support.google.com/adsense/answer/1346295?hl=pt-BR).

Ativar somente após haver conteúdo editorial original, navegação completa, políticas e integrações adequadas, aprovação da conta/site e uma amostra de audiência que permita medir o efeito. Não existe neste plano um número mágico de visitas que garanta aprovação ou receita.

Usar artigos com URLs reais separadas das ferramentas. Exclusões de anúncios automáticos não aceitam fragmentos como `#respirar` ou parâmetros de URL; isso importa se os rituais dividirem a mesma página. [Fonte: exclusões de páginas no AdSense](https://support.google.com/adsense/answer/9262311?hl=pt-BR).

Testar poucos espaços e comparar receita com lentidão, continuidade da leitura e uso dos rituais. Se o ganho for pequeno e a experiência piorar, remover. Bloquear peças inadequadas não garante que todos os anúncios tenham a estética da marca.

### Como avaliar a economia

Separar receita bruta de resultado. Para produto próprio: compras pagas × preço, menos taxas, reembolsos, produção, atendimento e aquisição. Para afiliados: comissão confirmada, considerando estornos e regras do programa. Para anúncios: páginas monetizadas / 1.000 × RPM observado.

Exemplo apenas aritmético: 10.000 visitas, conversão hipotética de 0,5% e preço de R$39 resultariam em 50 compras e R$1.950 brutos. Isso não estima o que o Acalmo conseguirá. Visitas, taxa de compra e margem precisam ser medidos no próprio projeto.

## Aquisição e conteúdo

Começar por três conjuntos de intenção: pausa entre tarefas, transição depois do trabalho e preparação da noite. Cada página deve ter uma resposta útil e um próximo passo real. Exemplos editoriais: “Como criar uma pausa entre reuniões”, “Um ritual curto para encerrar o trabalho” e “Como preparar um ambiente mais tranquilo à noite”.

Publicar pouco e revisar. Informar autoria real, fontes e data de atualização quando o conteúdo mudar. Não inventar profissionais revisores ou selos de validação. Quando houver afirmações de saúde, manter o escopo responsável e buscar revisão qualificada antes de ampliar a promessa.

O Google recomenda conteúdo original, útil e criado para beneficiar pessoas, com autoria e fontes que inspirem confiança. Quantidade de artigos, contagem de palavras ou repetição de palavras-chave não substituem essa qualidade. [Fonte: conteúdo útil na Central da Pesquisa Google](https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=pt-br).

Após tornar o site público e conectar o domínio, revisar URLs canônicas, sitemap, robots, metadados sociais e indexação. A prévia privada não deve ser tratada como um canal de aquisição orgânica já ativo.

Nas redes, testar pequenos trechos da experiência: uma transição da esfera, uma paisagem sonora e uma frase original. Cada peça leva diretamente à experiência correspondente. Comparar visitas que começam uma pausa, não apenas visualizações de vídeos. Compartilhamentos espontâneos são uma possibilidade a testar, sem garantia de alcance.

## Medição e experimentos

O site não precisa ativar analytics externos para funcionar. A medição abaixo é um plano para quando estiverem definidos o fornecedor, os dados, a finalidade, a retenção e as escolhas de privacidade aplicáveis. Até lá, testes observados e entrevistas já produzem evidência útil.

| Pergunta | Métrica proposta | Como interpretar |
| --- | --- | --- |
| A proposta ficou clara? | Pessoas que iniciam uma experiência / visitas elegíveis | Separar origem e versão; não contar navegação automática |
| A sessão é utilizável? | Sessões concluídas / sessões iniciadas | Considerar duração; encerramento livre continua legítimo |
| Existe motivo para voltar? | Retorno em 7 e 30 dias com método de medição definido | Não fabricar identificação persistente ou rastrear o diário |
| A personalização ajuda? | Escolhas favoritas e reuso | Um favorito sem reuso não prova hábito |
| A frase apresenta o site? | Ações de compartilhar/download e acessos atribuíveis quando disponíveis | Abertura do compartilhamento não confirma envio |
| A oferta gera interesse real? | Acesso à oferta, checkout iniciado e compras confirmadas | Não chamar clique de compra ou receita |
| A compra entrega valor? | Uso do material, dúvidas, reembolsos e feedback | Usar dados de entrega/checkout realmente disponíveis |

Eventos funcionais possíveis: `experience_started`, `experience_paused`, `experience_completed`, `sound_mix_saved`, `quote_downloaded`, `guide_opened` e `offer_clicked`. Limitar propriedades a dados como recurso, duração escolhida e versão da interface. Não transmitir textos do diário, estado emocional inferido, conteúdo de formulários, rascunhos, nomes ou conteúdo de favoritos pessoais.

Os nomes são uma especificação futura; não significam que uma ferramenta de analytics foi instalada. Mesmo eventos funcionais podem demandar decisões de privacidade e não são automaticamente anônimos.

Primeiro teste: 10–15 participantes do público, usando o próprio celular quando possível. Pedir para iniciar uma pausa, encerrar ou repetir, montar sons, encontrar um favorito e escrever sem salvar. Observar dificuldades antes de explicar. Uma meta interna de 8 em 10 concluírem a tarefa principal sem ajuda pode orientar a primeira correção; essa amostra não comprova demanda de mercado.

Depois, testar uma mudança por vez: entrada direta versus escolha por intenção; duração inicial curta versus seleção prévia; guia gratuito após a conclusão versus em navegação secundária. Com pouco tráfego, preferir evidência qualitativa e direção de efeito; não declarar um vencedor estatístico sem amostra apropriada.

## Privacidade e limites operacionais

O diário fica local por decisão de arquitetura desta versão. Isso reduz transmissão, mas não equivale a criptografia, sigilo absoluto ou backup. Outros usuários do mesmo perfil do aparelho e scripts que executem na mesma origem podem ter acesso ao armazenamento. O navegador pode apagar dados; a navegação privada muda sua persistência. A MDN documenta que `localStorage` é compartilhado entre documentos da mesma origem e pode persistir após fechar o navegador. [Fonte: Web Storage API, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).

Explicar em linguagem simples: “Salvo somente neste navegador. Não sincroniza entre aparelhos. Evite salvar em um aparelho compartilhado.” Permitir apagar registros. Não registrar textos do diário em logs, métricas, URLs, notificações ou arquivos de diagnóstico. O modo offline não transforma o navegador em um cofre seguro.

Não pedir conta, localização, microfone, câmera ou notificações para realizar os rituais. Antes de incluir publicidade, analytics, formulários externos ou sincronização, reavaliar quais dados passam a sair do dispositivo e atualizar a explicação pública. Não declarar conformidade legal completa apenas por não usar cookies publicitários nesta etapa.

## Plano de 30, 60 e 90 dias

| Período | Entrega e trabalho | Evidência para decidir o próximo passo |
| --- | --- | --- |
| Até 30 dias | Validar versão funcional em celular e desktop; corrigir barreiras; definir responsável/editor e canais reais; revisar conteúdo; decidir publicação e domínio; observar 10–15 usos | Pessoas compreendem a proposta, iniciam e encerram sem ajuda; relatos de utilidade; recursos mais procurados |
| De 31 a 60 dias | Concentrar a home nas experiências usadas; revisar 3–6 conteúdos originais; testar pequenos formatos sociais; melhorar favoritos; produzir uma amostra da oferta | Retorno e compartilhamento observados; dúvidas recorrentes; interesse específico no material; custo de manter o site |
| De 61 a 90 dias | Se houver evidência e material pronto, conectar oferta paga e poucos afiliados; testar aquisição pequena com limite definido; avaliar publicidade somente nas páginas adequadas | Vendas confirmadas, margem, suporte e reembolso; tráfego qualificado; efeito de anúncios sobre experiência; decisão de continuar, ajustar ou adiar |

Os prazos organizam trabalho; não garantem que o produto estará monetizando ou indexado até uma data específica.

## Decisões pendentes do proprietário

1. Conectar acalmo.com.br e definir quando tornar a versão acessível ao público.
2. Informar a identidade editorial e o contato que devem aparecer nas páginas de apresentação e políticas, sem usar endereços inventados.
3. Confirmar se já existe produto, checkout, programa de afiliados ou conta AdSense. Na ausência de links reais, manter integrações comerciais desligadas.
4. Aprovar o conteúdo e a forma final do primeiro pacote pago; definir produção de voz, direitos de uso, entrega e suporte.
5. Definir se haverá medição externa, o fornecedor, quais dados são necessários e as escolhas de privacidade antes da ativação.
6. Decidir se há demanda para e-mail ou sincronização; ambos exigem uma etapa operacional e técnica além da versão local.

## Critério para manter a direção

Uma funcionalidade permanece se ajuda alguém a começar, completar ou repetir uma pausa com menos esforço. Um conteúdo permanece se resolve uma dúvida com clareza e autoria responsável. Uma fonte de receita permanece se paga por valor entregue sem tornar a pausa mais agitada. Esses critérios orientam o crescimento do Acalmo conforme surgirem dados reais.
