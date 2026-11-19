#!/bin/sh
set -eu

command=start
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

case "${1:-}" in
    -I)
        shift
        docker compose -f "$script_dir/docker-compose.yml" up -d db
        exec docker compose -f "$script_dir/docker-compose.yml" run --rm --service-ports "$@" app
        ;;
    -r)
        command=restart
        shift
        ;;
esac

exec docker compose -f "$script_dir/docker-compose.yml" "$command" "$@"
