const stub = (fd) => ({ fd, write() { return true; }, isatty() { return false; } });
if (typeof globalThis.MessagePort === "undefined") {
  try { globalThis.MessagePort = class MessagePort {}; } catch {}
}
if (typeof globalThis.MessageChannel === "undefined") {
  try { globalThis.MessageChannel = class MessageChannel { constructor() { this.port1 = {}; this.port2 = {}; } }; } catch {}
}
if (typeof globalThis.FinalizationRegistry === "undefined") {
  try { globalThis.FinalizationRegistry = class FinalizationRegistry { constructor() {} register() {} unregister() {} }; } catch {}
}
if (typeof globalThis.WeakRef === "undefined") {
  try { globalThis.WeakRef = class WeakRef { constructor(t) { this._t = t; } deref() { return this._t; } }; } catch {}
}
const gp = globalThis.process;
if (gp) {
  if (!gp.stderr) { try { gp.stderr = stub(2); } catch {} }
  if (!gp.stdout) { try { gp.stdout = stub(1); } catch {} }
  if (!gp.env) { try { gp.env = {}; } catch {} }
  if (!gp.versions) { try { gp.versions = { node: "22.0.0", openssl: "3.0.0" }; } catch {} }
  if (!gp.release) { try { gp.release = { name: "node" }; } catch {} }
  if (!gp.platform) { try { gp.platform = "linux"; } catch {} }
  if (!gp.arch) { try { gp.arch = "x64"; } catch {} }
  if (typeof gp.version !== "string") { try { gp.version = "v22.0.0"; } catch {} }
  if (typeof gp.cwd !== "function") { try { gp.cwd = () => "/"; } catch {} }
  if (typeof gp.nextTick !== "function") { try { gp.nextTick = (fn, ...args) => { queueMicrotask(() => fn(...args)); }; } catch {} }
if (typeof gp.hrtime !== "function") {
  try {
    const hrtime = (t) => {
      const ns = BigInt(Math.floor(performance.now() * 1e6));
      return t ? ns - t : ns;
    };
    hrtime.bigint = () => BigInt(Math.floor(performance.now() * 1e6));
    gp.hrtime = hrtime;
  } catch {}
}
if (typeof gp.on !== "function") {
  try {
    const noop = () => {};
    gp.on = noop; gp.off = noop; gp.once = noop;
    gp.addListener = noop; gp.removeListener = noop; gp.prependListener = noop;
    if (typeof gp.kill !== "function") gp.kill = noop;
    if (typeof gp.exit !== "function") gp.exit = noop;
    if (typeof gp.umask !== "function") gp.umask = () => 0;
    if (typeof gp.argv0 !== "string") gp.argv0 = "node";
    if (!Array.isArray(gp.argv)) gp.argv = ["node"];
    if (typeof gp.execPath !== "string") gp.execPath = "/usr/bin/node";
    if (!gp.env) gp.env = {};
    if (typeof gp.env.NODE_ENV !== "string") gp.env.NODE_ENV = "production";
  } catch {}
}
} else {
  try {
    globalThis.process = {
      env: {},
      stderr: stub(2),
      stdout: stub(1),
      versions: { node: "22.0.0", openssl: "3.0.0" },
      release: { name: "node" },
      platform: "linux",
      arch: "x64",
      version: "v22.0.0",
      cwd: () => "/",
      nextTick: (fn, ...args) => { queueMicrotask(() => fn(...args)); },
    };
  } catch {}
}
