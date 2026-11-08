#!/bin/sh
set -eu

command=start
if [ "${1:-}" = "-r" ]; then
    command=restart
    shift
fi

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
exec docker compose -f "$script_dir/docker-compose.yml" "$command" "$@"
