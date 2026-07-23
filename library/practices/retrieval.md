---
id: PRACTICE-retrieval
type: practice
owner: mentor-architect
status: active
host: stack-neutral
provenance: distilled from the 2026-07-23 research sweep (vector/RAG/frontier thread) — Anthropic (contextual retrieval; the ~200k-token skip-RAG line; the native memory tool), Chroma (context rot), Jason Liu (systematically improving RAG — recall@k first, inventory-vs-capability), the hybrid-search/RRF + recursive-512 chunking consensus. The whole value is telling a founder what NOT to build yet. Pairs with ai-first-init, context-discipline, harness-engineering. BOSS v0.114.0.
---

# Practice — Retrieval (a ladder, not a vector database — climb only when it hurts)

> **Where this sits.** This is a *build-time* practice, and its whole value is **subtraction**: telling a
> founder what NOT to build. Retrieval is the one area where a first-timer makes an *expensive wrong turn* — a
> vector DB, GraphRAG, a memory framework — none of which they need yet. Climb the ladder one rung at a time,
> and only when a metric says to.

## "RAG is dead"? — the naive version is; retrieval isn't

The 2026 viral claim ("1M-token windows killed RAG, just dump everything in context") is false as stated but
points at something true: **naive chunk-and-pray RAG is dying; retrieval is not** (~60% of production LLM apps
still retrieve). The honest tradeoff:

- **Cost:** retrieval is ~1000× cheaper per query than stuffing a large corpus into context.
- **Latency:** retrieval ≈ 1s; a 1M-token request ≈ 30–60s.
- **Accuracy — "context rot" (the load-bearing finding, Chroma 2025):** models do *not* use long context
  uniformly — reliability degrades as input grows *even on simple tasks*, and effective usable context is often
  **~60–70% of the advertised window.** Long context is not free retrieval.

**The decision line (Anthropic):** if your knowledge base is **< ~200k tokens (~500 pages)** and fairly static,
**skip RAG — put it in the prompt.** Above ~500k tokens, or if you need frequent queries / sub-3s latency /
citations / auditability, **retrieve, then reason.** In between, long context with care.

## Rung 0 — "can Claude Code just grep this?"

Before any of the below: a founder building *in Claude Code* already has **agentic retrieval for free** —
grep/file-search over a repo is retrieval-as-a-tool with **no vector DB**. Many founders' "I need RAG" is
smaller than they think. Reach for the ladder only when the data isn't a repo the agent can search directly.

## The ladder (climb on a metric, not on hype)

1. **Dense vector search alone** — start here.
2. **Hybrid (BM25 + vector, fused by Reciprocal Rank Fusion, default k=60)** — add the moment you miss on
   names, product codes, jargon, exact terms. RRF needs no tuning and beats either method alone.
3. **Reranking (a cross-encoder — Cohere Rerank / Voyage)** — add when the right answer is *in* your candidate
   set but not at the top. Retrieve top-50→200, rerank to ~top-4/20.
4. **Graph / agentic RAG** — only for multi-hop "connect-the-dots" questions. Agentic RAG (retrieval as a tool
   the model calls in a loop) costs 3–10× tokens and 2–5× latency; earn it.

**The standout durable technique — Anthropic's Contextual Retrieval:** prepend a one-sentence LLM-generated
context to each chunk before indexing (made economical with prompt caching). Cut top-20 retrieval failure by
35% (contextual embeddings) → 49% (+ contextual BM25) → 67% (+ reranking).

## The unglamorous defaults

- **Chunking:** recursive splitting at **~400–512 tokens with 10–20% overlap** is the best default. Semantic
  chunking buys ~+9% recall at ~14× the cost — do it only when your metrics say to.
- **Vector DB — "pgvector until it hurts":** < ~10M vectors → **pgvector** (if you already run Postgres, it's
  the obvious default: no new service, no new bill, SQL filtering, lower latency than a hosted DB under 10M) or
  Chroma; 10M–100M → Pinecone/Qdrant/Weaviate; 100M+ → Milvus/Vespa/Turbopuffer. A tiny app can use
  SQLite + sqlite-vec. **Move to a dedicated vector DB only when scale/latency/filtering actually hurts.**
- **Measure retrieval before optimizing it (Jason Liu):** generate synthetic question–chunk pairs, track
  **recall@k first** — a missed chunk is unrecoverable ("no model version fixes that"). Distinguish an
  *inventory* problem (the data isn't there) from a *capability* problem (it's there but unfindable). Ship →
  log → fix the failing segment → repeat.

## Agent memory (the same ladder, one level up)

Taxonomy is durable — short-term/working (in-context) vs long-term (**episodic** events / **semantic** facts /
**procedural** skills). The JIT ladder: recent history in prompt → summarize-and-store → **Claude's native
memory tool** (file-based, client-side, no framework) → a framework (Mem0/Letta/Zep) **only on a named wall**
(semantic search over thousands of facts across many users, or temporal correctness in a regulated domain).
Don't pick a memory framework off a leaderboard — the benchmarks are audited-error-laden and gameable; adoption
is the more honest signal. For a first app, a framework is later or never.

## Altitude / JIT

Silent until a founder's app must answer over data it can't hold in context. First question is always rung 0
("can the agent just grep it?"), then the ~200k-token line, then the ladder — one rung per real miss. Refresh on
the model/window curve ([[IDEA-014]]): the skip-RAG threshold moves as context windows and context-rot behavior
change. Related: [`context-discipline`](context-discipline.md) (the dumb zone is why long-context isn't free
retrieval), `ai-first-init`, [`harness-engineering`](harness-engineering.md).
