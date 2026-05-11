# perplexity-user-mcp

Standalone MCP stdio server for Perplexity, intended for Claude Code and Codex
CLI.

## Install

```bash
npx perplexity-user-mcp login --mode manual
```

The login command opens Google Chrome, waits for Perplexity sign-in to finish,
and stores the authenticated cookies in an encrypted profile vault under
`~/.perplexity-mcp`.

The launched Chrome uses a dedicated MCP browser profile, not your everyday
Chrome profile. If you use Google SSO, sign into Google in that MCP-launched
window once; the browser profile is kept under the active Perplexity profile.

## Run

MCP clients should start the server over stdio:

```bash
npx -y perplexity-user-mcp
```

## Environment

| Variable | Meaning |
| --- | --- |
| `PERPLEXITY_CONFIG_DIR` | Config/profile/vault directory. Defaults to `~/.perplexity-mcp`. |
| `PERPLEXITY_PROFILE` | Active profile name. Defaults to `default`. |
| `PERPLEXITY_BROWSER_PATH` | Optional absolute path to Google Chrome. |
| `PERPLEXITY_CHROME_PATH` | Legacy alias for `PERPLEXITY_BROWSER_PATH`. |
| `PERPLEXITY_VAULT_PASSPHRASE` | Vault unlock fallback when OS keychain is unavailable. |
| `PERPLEXITY_MCP_STDIO` | Set to `1` when running under an MCP client. |

See `../../docs/perplexity-config.md` for the plain config reference and
`../../templates` for Claude Code and Codex CLI config snippets.

## Host Agent Notes

Hermes Agent with text-only models such as DeepSeek can fail if its conversation
history contains screenshot payloads from desktop or browser tools:

```text
unknown variant image_url, expected text
```

That error is produced by the host agent/model request, not by Perplexity auth.
This MCP server returns text MCP content. For Hermes, set
`agent.image_input_mode: text` in `~/.hermes/config.yaml`, then restart Hermes
or start a fresh session.
