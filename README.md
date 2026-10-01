# Paróquia São Miguel Arcanjo

Site institucional da Paróquia São Miguel Arcanjo, em São Miguel do Araguaia – GO.

## Acesse o site

[https://paroquia-sao-miguel.frederico.chatgpt.site](https://paroquia-sao-miguel.frederico.chatgpt.site)

## Conteúdo

- Horários das missas
- Evangelho do dia: data, referência bíblica e trecho com acesso à leitura completa
- Informações sobre a paróquia
- Agenda, catequese, avisos e Web Rádio
- Informações de contato, localização e redes sociais

## Tecnologia

Aplicação React/Next com Vinext e Tailwind CSS, hospedada no Sites.

## Evangelho do dia

O bloco da página inicial consulta a Liturgia Diária da [Canção Nova](https://liturgia.cancaonova.com/pb/) por meio de `/api/liturgia`. A data segue `America/Sao_Paulo` (horário de Brasília) e é conferida com a data publicada na fonte antes de mostrar a leitura.

O site apresenta somente um trecho curto, com atribuição e link para a leitura completa. O conteúdo é atualizado ao abrir a página e na mudança do dia; consultas bem-sucedidas são reaproveitadas por até uma hora para reduzir o acesso à fonte. Um registro conferido no dia da publicação permite mostrar a leitura imediatamente e só é usado enquanto sua data coincide com o dia atual. Se a fonte estiver indisponível, leituras já verificadas para o mesmo dia são preservadas; em outro dia permanece o link para consultar a liturgia, sem apresentar uma leitura antiga como atual. O link do bloco abre o Evangelho completo na página de Liturgia Diária do próprio site.

## Liturgia Diária com calendário

A página `/liturgia-diaria` mantém a identidade da paróquia e apresenta as leituras completas, com calendário, campo de data, dia anterior, próximo dia e retorno ao dia atual. O botão da abertura e o link do Evangelho abrem essa página em outra guia. No celular, o calendário pode ser expandido sem ocupar o espaço inicial de leitura.

As leituras são consultadas pela [Liturgia Diária API v2](https://github.com/Dancrf/liturgia-diaria/blob/main/docs/v2/README.md), um serviço comunitário, por meio de `/api/liturgia/leituras?data=AAAA-MM-DD`. A resposta é validada contra a data pedida antes de exibir os textos. Consultas bem-sucedidas usam cache por data de até uma hora; falhas podem reaproveitar uma leitura já verificada apenas para a mesma data. Leituras alternativas e extras são preservadas, e a segunda leitura aparece somente quando fornecida. A página informa a origem dos dados e oferece nova tentativa e consulta externa quando a fonte não responde ou não possui a data. Não são arquivados textos completos no repositório.

## Versão anterior

O repositório original e a publicação anterior no Netlify permanecem preservados como versão 1.
