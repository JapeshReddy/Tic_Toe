FROM node:22-bookworm

# Install system dependencies
RUN apt-get update && apt-get install -y \
  git \
  curl \
  jq \
  && rm -rf /var/lib/apt/lists/*

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
  | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && apt-get update && apt-get install -y gh \
  && rm -rf /var/lib/apt/lists/*

# Build-args for UID/GID alignment: sandcastle docker build-image
# defaults these to the host user's UID/GID so image-built files
# and bind-mounted files share an owner without runtime chown.
ARG AGENT_UID=1000
ARG AGENT_GID=1000

# Rename the base image's "node" user to "agent" and align UID/GID.
RUN groupmod -o -g $AGENT_GID node && usermod -o -u $AGENT_UID -g $AGENT_GID -d /home/agent -m -l agent node
USER ${AGENT_UID}:${AGENT_GID}

# Install Claude Code CLI
RUN curl -fsSL https://claude.ai/install.sh | bash

# Add Claude to PATH
ENV PATH="/home/agent/.local/bin:$PATH"

# Pre-install the project's dependencies into the image, OUTSIDE the workspace.
#
# Sandcastle rebuilds the sandbox for every iteration, so an onSandboxReady
# `npm ci` was paid once per ticket — measured between 205s and 383s a time,
# because the workspace is a bind mount reaching back to the Windows filesystem
# across Docker Desktop's WSL2 bridge. Installing here instead puts node_modules
# on the container's own overlay filesystem, where it costs nothing at runtime.
#
# This must live outside /home/agent/workspace: the worktree bind-mount lands on
# that path at container start and would shadow anything installed there.
# onSandboxReady symlinks it in — see .sandcastle/main.ts.
#
# Rebuild the image whenever package.json or package-lock.json changes, or the
# agent runs against stale dependencies:
#   docker build -t sandcastle:tictactoe -f .sandcastle/Dockerfile --build-arg AGENT_UID=1000 --build-arg AGENT_GID=1000 .
WORKDIR /home/agent/deps
COPY --chown=${AGENT_UID}:${AGENT_GID} package.json package-lock.json ./
RUN npm ci --no-audit --fund=false

WORKDIR /home/agent

# In worktree sandbox mode, Sandcastle bind-mounts the git worktree at /home/agent/workspace
# and overrides the working directory to /home/agent/workspace at container start.
# Structure your Dockerfile so that /home/agent/workspace can serve as the project root.
ENTRYPOINT ["sleep", "infinity"]
