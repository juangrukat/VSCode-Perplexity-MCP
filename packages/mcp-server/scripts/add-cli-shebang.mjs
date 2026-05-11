#!/usr/bin/env node

import { chmodSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const cliPath = resolve(import.meta.dirname, "..", "dist", "cli.mjs");
const shebang = "#!/usr/bin/env node\n";
const current = readFileSync(cliPath, "utf8");

if (!current.startsWith(shebang)) {
  writeFileSync(cliPath, shebang + current, "utf8");
}

chmodSync(cliPath, 0o755);
