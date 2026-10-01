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

O site apresenta somente um trecho curto, com atribuição e link para a leitura completa. O conteúdo é atualizado ao abrir a página e na mudança do dia; consultas bem-sucedidas são reaproveitadas por até uma hora para reduzir o acesso à fonte. Um registro conferido no dia da publicação permite mostrar a leitura imediatamente e só é usado enquanto sua data coincide com o dia atual. Se a fonte estiver indisponível, leituras já verificadas para o mesmo dia são preservadas; em outro dia permanece o link para consultar a liturgia, sem apresentar uma leitura antiga como atual. O acesso à leitura completa fica concentrado no bloco Evangelho do dia, com link direto para a Canção Nova.

## Versão anterior

O repositório original e a publicação anterior no Netlify permanecem preservados como versão 1.
