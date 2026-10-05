// env-guard — preloaded into every test run (`node --test --import ./test/env-guard.js`).
//
// WHY THIS EXISTS (IDEA-136 · F8): tests that isolate through a temp HOME spread `...process.env`
// into their child processes, and `src/paths.js` prefers BOSS_HOME over HOME. So a developer shell
// with BOSS_HOME exported pointed the suite at that directory: one run wrote a registry, a conscience
// log, and a `removed/` folder from `boss remove` into it, and 11 tests failed. A test that needs
// BOSS_HOME sets it on its own spawn; nothing inherits one from the shell.
delete process.env.BOSS_HOME;
