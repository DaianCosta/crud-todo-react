# ADR-001 — Persistência exclusivamente em localStorage

## Status

Aceita

## Contexto

O pedido original e os requisitos do produto especificam explicitamente que os dados devem ser salvos em `localStorage`, sem banco de dados nem back-end.

## Decisão

A aplicação persiste todas as tarefas no `localStorage` do navegador, sob a chave `tasks`, como um array JSON.

## Alternativas consideradas

1. **IndexedDB**: maior capacidade e suporte a consultas, mas complexidade desnecessária para uma lista simples de tarefas.
2. **Back-end + PostgreSQL**: fora de escopo por decisão explícita do produto.

## Consequências

- **Positivas**: simplicidade máxima, sem dependências de infraestrutura, funcionamento offline nativo.
- **Negativas**: dados limitados ao navegador do usuário; sem sincronização entre dispositivos; limite de ~5 MB no localStorage (suficiente para milhares de tarefas).
- O modelo de dados é plano (sem relacionamentos), adequado ao formato JSON do localStorage.
