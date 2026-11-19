#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$(dirname -- "$script_dir")" && cd - && pwd)
repo_name=$(basename "$repo_root")

if [ -t 0 ] && [ -t 1 ]; then
    exec docker compose -f "$script_dir/docker-compose.yml" -p "${repo_name}" exec app sh -c "$*"
else
    exec docker compose -f "$script_dir/docker-compose.yml" -p "${repo_name}" exec -T app sh -c "$*"
fi
