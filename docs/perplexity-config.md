# Perplexity Config Reference

This file explains the fields in `perplexity.config.example.json`. The MCP
server itself is configured through environment variables so Claude Code, Codex
CLI, and other agents can adapt the template into their own config files.

| Field | Meaning | Runtime equivalent |
| --- | --- | --- |
| `configDir` | Directory for profiles, encrypted vault data, browser state, history, and cache files. | `PERPLEXITY_CONFIG_DIR` |
| `profile` | Active Perplexity profile/account name. Defaults to `default`. | `PERPLEXITY_PROFILE` |
| `browserPath` | Optional absolute path to Google Chrome. Leave empty for auto-detection. | `PERPLEXITY_BROWSER_PATH` or `PERPLEXITY_CHROME_PATH` |
| `vaultPassphraseEnv` | Name of the environment variable that can unlock the vault on systems without a usable OS keychain. | `PERPLEXITY_VAULT_PASSPHRASE` |
| `loginMode` | `manual` opens Chrome for sign-in. `auto` uses email/OTP where supported. | CLI `login --mode manual\|auto` |

Authentication is cookie-based. Login opens Google Chrome against
`https://www.perplexity.ai`, waits until the `__Secure-next-auth.session-token`
cookie is present, stores the browser cookies in the encrypted profile vault,
and writes account metadata/model cache under `configDir`.

The launched Chrome does not use your normal Chrome user profile. It uses the
active MCP profile's `browser-data` directory. This keeps automation isolated
from your personal browser while still allowing Google SSO state from the MCP
login window to persist between Perplexity login attempts.
