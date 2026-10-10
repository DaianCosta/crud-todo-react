# ADR-003 — Lembrete baseado em data (não data/hora)

## Status

Aceita

## Contexto

O gate humano HG-001 respondeu que o lembrete deve notificar "no dia da execução da tarefa". O PM atualizou os requisitos para refletir: o lembrete é uma data (YYYY-MM-DD), e tarefas com lembrete para o dia atual recebem destaque visual e notificação.

## Decisão

O campo `reminder` armazena apenas a data (string `"YYYY-MM-DD"` ou `null`). A comparação é feita com a data local do navegador (`new Date().toISOString().slice(0, 10)` ou `toLocaleDateString`). Não há hora nem margem de minutos.

## Alternativas consideradas

1. **Lembrete com data e hora + margem de 15 min**: era a suposição inicial do PM, substituída pela resposta do usuário no HG-001.
2. **Notificação push do sistema operacional**: explicitamente fora de escopo.

## Consequências

- **Positivas**: implementação simples; o usuário escolhe um dia no date picker do MUI; a comparação é trivial.
- **Negativas**: granularidade limitada ao dia; sem hora específica. Adequada ao pedido do usuário.
