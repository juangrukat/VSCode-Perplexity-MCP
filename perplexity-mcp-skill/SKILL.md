---
name: perplexity-mcp-skill
description: Use Perplexity MCP tools (search, reason, ask, research) via a Pro account — model selection, technique patterns, and per-tool reference.
version: 1.0.0
author: Agentic
license: MIT
metadata:
  agent:
    tags:
      - perplexity
      - mcp
      - search
      - research
      - ai-query
    category: integrations
    related_skills:
      - native-mcp
    requires_toolsets:
      - terminal
    requires_tools:
      - perplexity_search
      - perplexity_reason
      - perplexity_ask
      - perplexity_research
      - perplexity_models
      - perplexity_doctor
      - perplexity_list_researches
      - perplexity_get_research
      - perplexity_retrieve
      - perplexity_export
      - perplexity_sync_cloud
    required_environment_variables: []
config: {}
---

## When to Use
- Use when you need live web search, reasoning, or deep research via Perplexity MCP tools.
- Use when the user asks a factual question, needs analysis, or wants a research deep-dive.
- Use when selecting specific Perplexity models (GPT-5.4, Claude 4.6 Sonnet, Gemini 3.1 Pro).
- Use for multi-turn conversations where follow-up context must be preserved.
- Do NOT use when the question is answerable from existing knowledge or local tools alone.
- Do NOT use `perplexity_research` for simple lookups — it consumes quota.

---

## Quick Reference

| Step | Action | Notes |
|------|--------|-------|
| 1 | Pick the right tool | `search` for facts, `reason` for analysis, `ask` for control, `research` for deep dives |
| 2 | Select a model | Use model keys like `gpt54`, `claude46sonnet`, `gemini31pro_high` |
| 3 | Add optional params | `sources`, `language`, `mode` (concise/copilot) |
| 4 | Handle follow-ups | Use `perplexity_ask` with `follow_up_context` as a JSON string |

---

## Procedure

### Step 1: Choose the right tool

| Tool | Best for | Model selection |
|------|----------|----------------|
| `perplexity_search` | Quick factual queries, current events | Auto-selected — no model param needed |
| `perplexity_reason` | Multi-step analysis, explanations | Pass `model` for thinking models |
| `perplexity_ask` | Full control over model + mode | Pass `model` + `mode` (concise/copilot) |
| `perplexity_research` | Deep long-form research (uses quota) | Auto-selected |

### Step 2: Use the correct model keys

**Working models (Pro account):**
- `gpt54` — search, ask (general)
- `gpt54_thinking` — reason, ask (analysis)
- `claude46sonnet` — search, ask (nuance)
- `claude46sonnetthinking` — reason, ask (deep analysis)
- `gemini31pro_high` — reason, ask (technical/scientific)
- `pplx_pro_upgraded` — search, reason (auto-select)

**NOT working (Pro — avoid):**
- `experimental` (Sonar 2) — returns "Failed to fetch"
- `gpt55*` — MAX tier only
- `claude47opus*` — MAX tier only
- `o4mini`, `o3pro` — research mode only, may be tier-gated
- `pplx_asi_*` — ASI/computer mode (not included per preference)

### Step 3: Add optional parameters

For any tool, append these parameters when appropriate:

- `sources` — `["web"]` (default), `["web", "scholar"]` (academic), `["web", "social"]` (social discourse)
- `language` — ISO code like `"zh"`, `"ja"`, `"es"` for non-English results
- `mode` — `"concise"` (short answer, faster) or `"copilot"` (detailed with citations) — only on `perplexity_ask`
- `follow_up_context` — MUST be a JSON string (use `JSON.stringify({...})`), not a plain text object

### Step 4: Use proven techniques

**Model selection pattern** — State the model in your request:
- "Use GPT-5.4 Thinking to analyze..." → `perplexity_reason` with `model: "gpt54_thinking"`
- "Search with Claude Sonnet 4.6 for..." → `perplexity_search` with `model: "claude46sonnet"`
- "Ask Perplexity (concise, Gemini 3.1 Pro) about..." → `perplexity_ask` with `mode: "concise", model: "gemini31pro_high"`

**Research + retrieve workflow** — For long research that might time out:
1. Start with `perplexity_research`
2. If it times out, note the research ID
3. Use `perplexity_retrieve` with that `research_id` later
4. Use `perplexity_list_researches` to find all completed research

**Multi-turn conversation** — Always use `perplexity_ask` with `follow_up_context`:
```
query: "And how does error handling work?"
follow_up_context: '{"previousQuery": "Rust vs Go concurrency", "answeredBy": "gpt54"}'
```

**Scholar mode** — For academic topics, add `sources: ["web", "scholar"]` to `perplexity_search` or `perplexity_reason`.

### Step 5: Use diagnostics when something is wrong

Run `perplexity_doctor` (no parameters) for a 10-category health check.
Pass `probe: true` for a live search probe.
Run `perplexity_models` to list available models and verify account status.

---

## Pitfalls
- **`follow_up_context` type mismatch:** Perplexity requires it as a JSON string, not a plain object or a JS object. Always wrap with `JSON.stringify()` or pass a pre-serialized string.
- **Research timeout:** Long `perplexity_research` calls may time out. Always capture the `research_id` from the response and use `perplexity_retrieve` to get results later.
- **Model not found / "Failed to fetch":** You may be using a MAX-tier or ASI-tier model that the Pro account can't access. Stick to the working models listed above.
- **Quota depletion:** `perplexity_research` and `perplexity_compute` consume rate-limited quota. Prefer `perplexity_search` or `perplexity_ask` for routine queries.
- **Sync issues:** Cloud history may be out of sync. Run `perplexity_sync_cloud` before `perplexity_list_researches` if recent results are missing.

---

## Verification
- [ ] `perplexity_models` returns a list of available models with no errors.
- [ ] `perplexity_doctor` runs clean (exit 0 on all checks).
- [ ] A search query returns relevant results with citations.
- [ ] `perplexity_ask` with `mode: "copilot"` returns a longer, cited answer.
- [ ] A follow-up query with `follow_up_context` as JSON string succeeds.
