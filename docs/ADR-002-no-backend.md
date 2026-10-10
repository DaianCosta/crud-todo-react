# ADR-002 — Sem back-end nem serviço de API

## Status

Aceita

## Contexto

Os requisitos listam "Back-end, API ou banco de dados" como fora de escopo. O stack da squad inclui Python + FastAPI e React + MUI, mas os requisitos explicitamente dispensam a camada de back-end.

## Decisão

Não criar a pasta `back-end/`. Toda a aplicação vive em `front-end/`. O `docker-compose.yml` terá apenas o serviço `frontend`.

## Alternativas consideradas

1. **Criar o back-end para futura expansão**: violaria o princípio de escopo da constituição ("Faça o que o pedido e os requisitos pedem, nada além").

## Consequências

- **Positivas**: menor complexidade, deploy simplificado, sem dependência de PostgreSQL.
- **Negativas**: se no futuro for necessário back-end, será criado do zero (decisão alinhada com os requisitos atuais).
- O contrato de API (`api-contract.md`) documenta apenas a interface interna dos hooks.
