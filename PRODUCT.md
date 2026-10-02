# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pessoas que acompanham a Paróquia São Miguel Arcanjo, em São Miguel do Araguaia, Goiás.

## Product Purpose

Apresentar a paróquia, os horários das missas, a agenda, os contatos e as leituras da liturgia diária.

## Capabilities and Constraints

- O acesso é público, sem autenticação.
- As imagens originais devem ser preservadas, com a substituição autorizada da arte de Avisos semanais pela imagem de Avisos Paroquiais enviada pelo usuário.
- A arte de Avisos Paroquiais aparece no card da agenda e na página de avisos, inteira e proporcional, mantendo os tamanhos e alinhamentos existentes.
- O card Web Rádio São Miguel e seu botão de acesso abrem o canal https://www.youtube.com/@paroquiasaomiguelarcanjosma em outra guia.
- A Liturgia Diária abre em outra guia, no próprio site da paróquia, com calendário para consultar as leituras por data.
- A página inicial oferece um único botão de Liturgia Diária; as leituras e a identificação da fonte ficam na página dedicada.
- As datas da liturgia acompanham o horário de Brasília.
- A indisponibilidade da fonte não deve mostrar uma leitura de outra data como se fosse a selecionada.

## Brand Commitments

Manter o nome da Paróquia São Miguel Arcanjo e o visual já aprovado no site. A página de leituras do Santuário Basílica Sagrada Família é uma referência de funcionalidade, com identidade visual própria da Paróquia São Miguel.

## Evidence on Hand

Conteúdo e imagens existentes em `app/page.tsx`, páginas internas em `app/`, consulta das leituras em `lib/daily-readings.ts` e documentação da Liturgia Diária API em https://github.com/Dancrf/liturgia-diaria/blob/main/docs/v2/README.md.
