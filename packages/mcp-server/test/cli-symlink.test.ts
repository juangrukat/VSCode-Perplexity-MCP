import { execFile } from "node:child_process";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("CLI direct-run guard", () => {
  it("routes commands when cli.js is executed through a symlink", async () => {
    const dir = await mkdtemp(join(tmpdir(), "perplexity-cli-symlink-"));
    try {
      const target = resolve(import.meta.dirname, "..", "src", "cli.js");
      const link = join(dir, "perplexity-user-mcp");
      await symlink(target, link);

      const { stdout } = await execFileAsync(process.execPath, [link, "--version"]);

      expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
