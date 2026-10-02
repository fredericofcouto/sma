# Paróquia São Miguel Arcanjo

Site institucional da Paróquia São Miguel Arcanjo, em São Miguel do Araguaia – GO.

## Acesse o site

[https://paroquia-sao-miguel.frederico.chatgpt.site](https://paroquia-sao-miguel.frederico.chatgpt.site)

## Conteúdo

- Horários das missas
- Liturgia Diária: leituras completas e calendário em uma página própria
- Informações sobre a paróquia
- Agenda, catequese, avisos e Web Rádio
- Informações de contato, localização e redes sociais

## Tecnologia

Aplicação React/Next com Vinext e Tailwind CSS, hospedada no Sites.

## Catequese

A arte da Catequese enviada pelo usuário aparece inteira no card e na página `/catequese`, na proporção 3:2 e sem moldura branca, seguindo o padrão dos cards de Avisos semanais e Festa do Padroeiro.

## Web Rádio São Miguel

O card Web Rádio São Miguel da página inicial abre diretamente o [canal da paróquia no YouTube](https://www.youtube.com/@paroquiasaomiguelarcanjosma) em outra guia. O botão de acesso da página `/web-radio` também aponta para esse canal.

A arte da Web Rádio enviada pelo usuário aparece inteira no card, na proporção 3:2, seguindo o mesmo enquadramento dos cards de Avisos semanais e Festa do Padroeiro.

## Liturgia Diária com calendário

A página `/liturgia-diaria` mantém a identidade da paróquia e apresenta as leituras completas, com calendário, campo de data, dia anterior, próximo dia e retorno ao dia atual. O botão “Liturgia diária” da abertura acessa essa página em outra guia. A página inicial mantém somente esse acesso, e a identificação da fonte acompanha os textos na página de leituras. No celular, o calendário pode ser expandido sem ocupar o espaço inicial de leitura.

As leituras são consultadas pela [Liturgia Diária API v2](https://github.com/Dancrf/liturgia-diaria/blob/main/docs/v2/README.md), um serviço comunitário, por meio de `/api/liturgia/leituras?data=AAAA-MM-DD`. A resposta é validada contra a data pedida antes de exibir os textos. Consultas bem-sucedidas usam cache por data de até uma hora; falhas podem reaproveitar uma leitura já verificada apenas para a mesma data. Leituras alternativas e extras são preservadas, e a segunda leitura aparece somente quando fornecida. A página informa a origem dos dados e oferece nova tentativa e consulta externa quando a fonte não responde ou não possui a data. Não são arquivados textos completos no repositório.

## Versão anterior

O repositório original e a publicação anterior no Netlify permanecem preservados como versão 1.
