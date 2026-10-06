# Operação por chat (IA-first)

Site do Espaço Novo Tempo Umarizal (Next.js na Vercel). Eventos e avisos são controlados pelo Claude.

## Adicionar um evento
1. Edite `lib/events.ts` e inclua um item em `EVENTS` (slug em kebab-case, `startsAt` ISO com `-03:00`).
2. `npx tsc --noEmit && npx next build`.
3. Commit + push; o evento vai ao ar quando a branch entrar na `main` (deploy automático da Vercel).
4. Só depois do deploy, envie o aviso (abaixo).

## Enviar notificação push (só com aprovação explícita do usuário)
Variáveis: `SITE_URL` (domínio do site) e `ADMIN_TOKEN` (nunca escreva o token em arquivos, logs ou no chat).

Sempre confira antes (não envia nada):
    curl -s -X POST "$SITE_URL/api/push/send" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
      -d '{"eventSlug":"<slug>","dryRun":true}'

Enviar aviso de evento (monta título, data e link sozinho):
    ... -d '{"eventSlug":"<slug>"}'

Aviso livre (title ≤80, body ≤200, url começando em / ou https://):
    ... -d '{"title":"...","body":"...","url":"/eventos"}'

Nº de inscritos: `GET $SITE_URL/api/push/stats` com o mesmo header.
Inscrições mortas (404/410) são removidas automaticamente no envio. Nunca envie duas vezes o mesmo aviso.

## Configuração única na Vercel
Variáveis em `.env.example`. Sem `NEXT_PUBLIC_VAPID_PUBLIC_KEY` o botão de avisos não aparece.
No iPhone, as notificações só funcionam com o site adicionado à Tela de Início.
