# Claude — Repo Conventions

## Commits

- **Do not add `Co-Authored-By: Claude` trailers.** This is a private repo; no AI attribution in commit messages.
- Keep commit messages short and focused on the *why*.
- Always create new commits — never `--amend`.

## Environment notes

- The sandbox egress proxy resets browser CONNECT tunnels; Playwright cannot
  reach deployed URLs. Verify deployed workers with curl; run the Playwright
  contract suite against `wrangler dev` locally (same code path) or the local
  static server. `PW_BASE_URL` switches the test target.
- The Cloudflare API token has Workers + D1 permissions but NOT R2.
