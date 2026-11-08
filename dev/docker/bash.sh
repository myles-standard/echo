#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

if [ -t 0 ] && [ -t 1 ]; then
    exec docker compose -f "$script_dir/docker-compose.yml" exec app sh "$@"
else
    exec docker compose -f "$script_dir/docker-compose.yml" exec -T app sh "$@"
fi
