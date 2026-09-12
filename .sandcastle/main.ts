import { run, claudeCode } from "@ai-hero/sandcastle";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";

// Simple loop: an agent that picks open issues one by one and closes them.
// Run this with: npx tsx .sandcastle/main.ts
// Or add to package.json scripts: "sandcastle": "npx tsx .sandcastle/main.ts"

await run({
  // A name for this run, shown as a prefix in log output.
  name: "worker",

  // Sandbox provider — runs the agent inside an isolated container.
  sandbox: docker(),

  // The agent provider. The model string becomes the Claude Code CLI's --model
  // flag, which overrides ANTHROPIC_MODEL from .env — so name the DeepSeek model
  // explicitly here. Switch to deepseek-v4-pro for harder problems.
  agent: claudeCode("deepseek-flash[1m]"),

  // Path to the prompt file. Shell expressions inside are evaluated inside the
  // sandbox at the start of each iteration, so the agent always sees fresh data.
  promptFile: "./.sandcastle/prompt.md",

  // Maximum number of iterations (agent invocations) to run in a session.
  // Each iteration works on a single issue.
  maxIterations: 10,

  // Branch strategy — merge-to-head creates a temporary branch for the agent
  // to work on, then merges the result back to HEAD when the run completes,
  // so the agent never touches the host working directory.
  branchStrategy: { type: "merge-to-head" },

  // NOTE: copyToWorktree is deliberately not used. It seeds the worktree with
  // the host's node_modules to skip a cold install, but it shells out to the
  // Unix `cp`, which does not exist on a Windows host — the run fails with
  // "spawn cp ENOENT" before the sandbox starts. onSandboxReady installs
  // dependencies inside the container instead.

  // Lifecycle hooks — commands grouped by where they run (host or sandbox).
  hooks: {
    sandbox: {
      // onSandboxReady runs once after the sandbox is initialised and the repo is
      // synced in, before the agent starts.
      //
      // Dependencies are baked into the image at /home/agent/deps rather than
      // installed here. Sandcastle rebuilds the sandbox every iteration, so an
      // npm ci in this hook was paid once per ticket — 205s to 383s a time,
      // because the workspace is a bind mount back to the Windows filesystem.
      // Symlinking the pre-installed tree in costs milliseconds instead.
      //
      // The trade: the image must be rebuilt when package.json or the lockfile
      // changes, or the agent runs against stale dependencies. The build command
      // is in .sandcastle/Dockerfile.
      onSandboxReady: [
        {
          command: "ln -sfn /home/agent/deps/node_modules node_modules",
          timeoutMs: 30000,
        },
      ],
    },
  },
});
