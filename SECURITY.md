# Security

**Found a way past one of BOSS's guards, or a way it exposes something it says it keeps local?
Please report it privately, not in a public issue:**
<https://github.com/ajeshh/bossbuild/security/advisories/new>

What counts here:
- A way to read a secret's contents (`.env`, `secrets/`, keys) past the secrets guard or the deny floor
  BOSS writes into `.claude/settings.json`.
- A shipped hook that runs, writes or sends something it shouldn't.
- Anything leaving a founder's machine that BOSS says stays local. BOSS sends nothing in the background;
  `/feedback` shows what it sends before it sends it.

You'll get an answer from the maintainer. A fix ships under `## Unreleased` in `registry/CHANGELOG.md` and
reaches projects through `boss sync`. Only the latest version gets fixes.
