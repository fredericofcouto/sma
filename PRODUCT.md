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
- As imagens originais devem ser preservadas, com as substituições autorizadas das artes de Avisos semanais, Festa do Padroeiro e Web Rádio pelas imagens enviadas pelo usuário.
- A arte de Avisos Paroquiais aparece inteira, sem corte ou distorção, no card e na página de avisos. Os espaços das imagens da agenda acompanham a proporção 3:2 da arte, sem encolher dentro dos cards, mantendo os títulos e botões alinhados.
- A imagem da página interna de Avisos semanais usa sua proporção natural, sem a moldura branca dos logos. Esse ajuste é exclusivo da página interna e preserva o card da página inicial.
- A Festa do Padroeiro usa a arte de São Miguel Arcanjo com a Igreja Matriz enviada pelo usuário, no card e na página interna, seguindo o mesmo padrão dos avisos: imagem inteira, proporcional e sem moldura branca, com os cards alinhados.
- O card Web Rádio São Miguel e seu botão de acesso abrem o canal https://www.youtube.com/@paroquiasaomiguelarcanjosma em outra guia.
- O card da Web Rádio usa a arte enviada pelo usuário, inteira, sem corte ou distorção, na proporção 3:2 e sem moldura, seguindo o padrão dos cards de avisos e padroeiro.
- A Liturgia Diária abre em outra guia, no próprio site da paróquia, com calendário para consultar as leituras por data.
- A página inicial oferece um único botão de Liturgia Diária; as leituras e a identificação da fonte ficam na página dedicada.
- As datas da liturgia acompanham o horário de Brasília.
- A indisponibilidade da fonte não deve mostrar uma leitura de outra data como se fosse a selecionada.

## Brand Commitments

Manter o nome da Paróquia São Miguel Arcanjo e o visual já aprovado no site. A página de leituras do Santuário Basílica Sagrada Família é uma referência de funcionalidade, com identidade visual própria da Paróquia São Miguel.

## Evidence on Hand

Conteúdo e imagens existentes em `app/page.tsx`, páginas internas em `app/`, consulta das leituras em `lib/daily-readings.ts` e documentação da Liturgia Diária API em https://github.com/Dancrf/liturgia-diaria/blob/main/docs/v2/README.md.
