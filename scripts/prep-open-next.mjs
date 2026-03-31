/**
 * Windows / OneDrive often block removing `.open-next` (EPERM during OpenNext build).
 * If a plain delete fails, stop local `workerd.exe` (from `wrangler dev`) and retry.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const target = path.join(root, ".open-next");

function exists(p) {
	try {
		fs.accessSync(p);
		return true;
	} catch {
		return false;
	}
}

function removeOpenNextDir() {
	try {
		execSync(`attrib -r "${target}\\*.*" /s /d`, { stdio: "ignore" });
	} catch {
		// best-effort
	}
	try {
		execSync(`cmd /c rmdir /s /q "${target}"`, { stdio: "ignore" });
	} catch {
		// fall through
	}
	if (exists(target)) {
		fs.rmSync(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
	}
}

if (!exists(target)) {
	process.exit(0);
}

try {
	removeOpenNextDir();
} catch (err) {
	if (process.platform === "win32") {
		try {
			execSync("taskkill /F /IM workerd.exe", { stdio: "ignore" });
		} catch {
			// none running
		}
		try {
			removeOpenNextDir();
		} catch (err2) {
			console.error(err2);
			process.exit(1);
		}
	} else {
		console.error(err);
		process.exit(1);
	}
}

if (exists(target)) {
	console.error("Could not remove .open-next (still in use). Close wrangler dev / IDE locks and retry.");
	process.exit(1);
}
