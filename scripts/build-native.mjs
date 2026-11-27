import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { rename, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const appDir = path.join(root, "src", "app");
const nextDir = path.join(root, ".next");
const nextNativeDir = path.join(root, ".next-native");

const itemsToHide = [
  {
    active: path.join(appDir, "api"),
    hidden: path.join(appDir, "_api.native-disabled"),
  },
  {
    active: path.join(appDir, "robots.ts"),
    hidden: path.join(appDir, "_robots.native-disabled.ts"),
  },
  {
    active: path.join(appDir, "sitemap.ts"),
    hidden: path.join(appDir, "_sitemap.native-disabled.ts"),
  },
];

async function buildNative() {
  for (const item of itemsToHide) {
    if (existsSync(item.hidden)) {
      throw new Error(
        `Cannot build: ${item.hidden} already exists. Restore it manually before retrying.`,
      );
    }
  }

  const moved = [];

  try {
    for (const item of itemsToHide) {
      if (!existsSync(item.active)) continue;
      try {
        await rename(item.active, item.hidden);
        moved.push({ from: item.hidden, to: item.active });
      } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "EPERM") {
          throw new Error("Stop the dev server before running a native build.");
        }
        throw error;
      }
    }

    await rm(nextDir, { recursive: true, force: true });
    await rm(nextNativeDir, { recursive: true, force: true });

    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    const result = spawnSync(npm, ["run", "build"], {
      cwd: root,
      env: {
        ...process.env,
        CAPACITOR_BUILD: "1",
        NEXT_PUBLIC_NATIVE: "1",
      },
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    if (result.error) throw result.error;
    if (result.status !== 0) {
      process.exitCode = result.status ?? 1;
      return;
    }
    if (!existsSync(path.join(nextNativeDir, "index.html"))) {
      throw new Error("Native export did not generate .next-native/index.html.");
    }
  } finally {
    for (const item of moved.reverse()) {
      if (existsSync(item.from)) {
        await rename(item.from, item.to);
      }
    }
  }
}

buildNative().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
