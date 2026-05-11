# Perplexity User MCP

Standalone Perplexity MCP server for Claude Code and Codex CLI.

This repo has been trimmed down to the core server and authentication flow. It
does not ship a VS Code extension, webview dashboard, multi-IDE auto-config, or
remote daemon/tunnel layer.

## What Remains

- `packages/mcp-server` - the MCP stdio server and CLI.
- `templates/claude-code.mcp.json` - Claude Code MCP config template.
- `templates/codex-cli.config.toml` - Codex CLI MCP config template.
- `perplexity.config.example.json` - human-readable Perplexity config shape.
- `docs/perplexity-config.md` - explanation of the config fields.

## Authentication

Authentication uses a real Google Chrome session against Perplexity. It uses a
dedicated MCP browser profile under `~/.perplexity-mcp`, not your everyday
Chrome profile.

1. `npx perplexity-user-mcp login --mode manual`
2. Chrome opens to Perplexity.
3. Finish sign-in in Chrome.
4. The server waits for the `__Secure-next-auth.session-token` cookie.
5. Cookies and account metadata are stored under `~/.perplexity-mcp` in an encrypted profile vault.

Google Chrome is the only supported browser in this trimmed package. Set
`PERPLEXITY_BROWSER_PATH` if Chrome is installed somewhere unusual. If you use
Google SSO, sign into Google in the launched MCP Chrome window once; that state
is kept in the MCP profile for future login attempts.

## Claude Code

Use the template in `templates/claude-code.mcp.json`:

```json
{
  "mcpServers": {
    "Perplexity": {
      "command": "npx",
      "args": ["-y", "perplexity-user-mcp"],
      "env": {
        "PERPLEXITY_CONFIG_DIR": "~/.perplexity-mcp"
      }
    }
  }
}
```

## Codex CLI

Use the template in `templates/codex-cli.config.toml`:

```toml
[mcp_servers.Perplexity]
command = "npx"
args = ["-y", "perplexity-user-mcp"]

[mcp_servers.Perplexity.env]
PERPLEXITY_CONFIG_DIR = "~/.perplexity-mcp"
```

## Development

```bash
npm install
npm run build
npm run typecheck
npm test
```

Useful CLI commands:

```bash
npx perplexity-user-mcp login --mode manual
npx perplexity-user-mcp status
npx perplexity-user-mcp doctor
npx perplexity-user-mcp list-accounts
npx perplexity-user-mcp switch-account default
```

## Troubleshooting

### Hermes / DeepSeek `unknown variant image_url`

If Hermes Agent is using a text-only model such as DeepSeek and a desktop or
browser tool captured a screenshot, Hermes may forward a stored `image_url`
message part to the model. DeepSeek rejects that request with an error like:

```text
Failed to deserialize the JSON body into the target type:
unknown variant image_url, expected text
```

This is not a Perplexity authentication failure. The MCP server returns text
content only; the bad image part comes from the host agent conversation history.

For Hermes, set image input routing to text mode in `~/.hermes/config.yaml`:

```yaml
agent:
  image_input_mode: text
```

Then restart Hermes or start a fresh Hermes session. If an old session already
contains screenshot history, a fresh session may still be required.
